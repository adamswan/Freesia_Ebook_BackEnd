import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as md5 from 'md5'
import { Like, Repository } from 'typeorm';


@Injectable()
export class UserService {
  constructor(
    //! 注入 user 表的存储库
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly formatInterceptor: FormattInterceptor
  ) {

  }

  // 新增用户（自己注册）
  async register(data) {
    const res = await this.userRepository.find({ where: { username: data.username } })
    if (res.length !== 0) {
      // 禁止注册同名角色
      throw new HttpException({
        code: HttpStatus.BAD_REQUEST,
        errorMSG: '已存在相同用户',
      }, HttpStatus.BAD_REQUEST);
    }

    const newUser = new User()
    newUser.username = data.username
    newUser.password = md5(data.password).toUpperCase()
    newUser.role = JSON.stringify(['role'])

    await this.userRepository.save(newUser)
    return {
      result: '成功',
      message: '注册成功'
    }
  }

  // 新增用户(管理员新增)
  async create(createUserDto: CreateUserDto) {
    // 先创建 user 实例
    const newUser = new User()
    // 再把传入的对象，添加为 user 实例的属性
    newUser.username = createUserDto.username
    newUser.password = md5(createUserDto.password).toUpperCase()
    newUser.role = createUserDto.role
    newUser.avatar = createUserDto.avatar
    newUser.nickname = createUserDto.nickname
    newUser.active = createUserDto.active // 默认激活
    await this.userRepository.save(newUser)
    return {
      result: '成功',
      message: '新增成功'
    }
  }

  // 查询所有用户
  async findAll(queryObj) {
    let page = Number(queryObj.page) || 1 // 页码
    let pageSize = Number(queryObj.pageSize) || 10 // 要多少条数据
    // 兜底
    if (page <= 0) {
      page = 1
    }
    if (pageSize <= 0) {
      pageSize = 10
    }

    const userID = queryObj.id
    const username = queryObj.username
    const active = queryObj.active

    const searchObj: any = {
      where: {
        id: userID ? Like(`%${userID}%`) : Like(`%%`),
        username: username ? Like(`%${username}%`) : Like(`%%`),
        active: active ? Like(`%${active}%`) : Like(`%%`)
      },
      skip: (page - 1) * pageSize, // 偏移量
      take: pageSize, // 每页数据条数
      // 排除掉 password
      select: ['id', 'role', 'avatar', 'nickname', 'active', 'username'],
    }

    const userList = await this.userRepository.find(searchObj);

    return {
      result: userList,
      message: '查询成功'
    }
  }

  // 查询单个用户
  findOne(id: number): Promise<User> {// 泛型参数 User 就是 user.entity.ts 中类规定的那些属性
    return this.userRepository.findOneBy({
      id
    })
  }

  // 删除指定用户
  async remove(id: number) {
    await this.userRepository.delete(id);
    return {
      result: '删除成功',
      message: '删除成功'
    };
  }

  async update(id: number, data: UpdateUserDto) {
    const res = await this.userRepository.update(id, data)
    return {
      result: res,
      message: '更新成功'
    };
  }

  // 登录时查询用户是否存在, 用户名是唯一的
  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username })
  }

  // 获取用户资料
  async getUserInfoByToken(username: string) {
    const uesr = await this.userRepository.findOne({
      // 排除掉 password
      select: ['id', 'role', 'avatar', 'nickname', 'active'],
      where: { username }
    })
    return {
      result: uesr
    }
  }
}
