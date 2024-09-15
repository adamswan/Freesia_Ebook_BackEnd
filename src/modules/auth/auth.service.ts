import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import * as md5 from 'md5'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // 服务共享
    private userService: UserService,
    private jwtService: JwtService
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

      // 登录成功后，返回 token
      const payload = {
        username: user.username,
        userid: user.id
      }
      const token = await this.jwtService.signAsync(payload)
      return {
        accessToken: token,
        message: '登录成功'
      }
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
