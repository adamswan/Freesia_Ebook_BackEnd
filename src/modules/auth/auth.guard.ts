import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants'
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {
    // 
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 提取当前路由中的元数据 IS_PUBLIC_KEY , 据此判断是否为公共路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果 isPublic 为 true，表示这是公共接口，不需要校验 token，直接放行
    if (isPublic) {
      return true;
    }

    // 请求对象
    const request = context.switchToHttp().getRequest();
    // 提取请求对象中的 token
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // 校验 token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // 将 payload 添加到请求对象 request 上，在路由中可以方便的获取到它
      // payload 长这样： { username: 'tim1', userid: 1, iat: 1726400625, exp: 1726487025 }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
