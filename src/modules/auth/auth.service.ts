import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import * as md5 from 'md5'
import { JwtService } from '@nestjs/jwt';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { AddNewAuthDto } from './dto/add-new-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // 服务共享
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {
    // 
  }

  // 登录
  async login(username: string, password: string) {
    // 先查询用户是否存在
    const user = await this.userService.findByUsername(username)
    console.log('user', user)

    if (user) {
      // 比较密码是否正确
      const md5Password = md5(password).toUpperCase()
      // console.log('md5Password', md5Password)
      if (user.password !== md5Password) {
        throw new UnauthorizedException()
      }

      // 登录成功后，返回 token
      const payload = {
        username: user.username,
        userid: user.id
      }
      const token = await this.jwtService.signAsync(payload)
      return {
        result: { token },
        message: '登录成功'
      }
    } else {
      // 用户不存在
      throw new UnauthorizedException()
    }
  }

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

    const key = queryObj.key
    const searchObj: any = {
      where: {
        key: key ? Like(`%${key}%`) : Like(`%%`),
      },
      skip: (page - 1) * pageSize, // 偏移量
      take: pageSize, // 每页数据条数
    }

    const authList = await this.authRepository.find(searchObj);

    return {
      result: authList,
      message: '查询成功'
    }
  }

  // 新增权限
  async addAuthd(data) {
    const newAuth = new Auth()
    newAuth.key = data.key
    newAuth.name = data.name
    newAuth.remark = data.remark

    const res = await this.authRepository.save(newAuth)
    return {
      result: res,
      message: '新增成功'
    }
  }


  async update(id: number, data: AddNewAuthDto) {
    const res = await this.authRepository.update(id, data)
    return {
      result: res,
      message: '编辑成功'
    }
  }

  async remove(id: number) {
    const res = await this.authRepository.delete(id)
    return {
      result: res,
      message: '删除成功'
    }
  }
}
