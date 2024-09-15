import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import * as md5 from 'md5'

@Injectable()
export class AuthService {
  constructor(
    // 服务共享
    private userService: UserService
  ) {

  }
  // 登录
  async login(username: string, password: string) {
    // 先查询用户是否存在
    const user = await this.userService.findByUsername(username)
    console.log('user', user)

    if (user) {
      // 比较密码是否正确
      const md5Password = md5(password).toUpperCase()

      if (user.password !== md5Password) {
        throw new UnauthorizedException()
      }
      return user;
    } else {
      // 用户不存在
      throw new UnauthorizedException()
    }


  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
