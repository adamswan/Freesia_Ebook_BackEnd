import { Injectable, Param, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
// import { UserLogin } from 'src/types/user';
// import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';


@Injectable()
export class UserService {
  constructor(
    //! 注入 user 表的存储库
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly formatInterceptor: FormattInterceptor
  ) {

  }

  // 新增用户
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 先创建 user 实例
    const newUser = new User()
    // 再把传入的对象，添加为 user 实例的属性
    newUser.username = createUserDto.username
    newUser.password = createUserDto.password
    newUser.role = createUserDto.role
    newUser.avatar = createUserDto.avatar
    newUser.nickname = createUserDto.nickname
    newUser.active = 1 // 默认激活
    const res = await this.userRepository.save(newUser)
    return res;
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
  remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
