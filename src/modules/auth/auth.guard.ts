import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    // 
  }

  canActivate(context: ExecutionContext): boolean {
    // 提取当前路由中的元数据 IS_PUBLIC_KEY , 据此判断是否为公共路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果 isPublic 为 true，表示这是公共接口，不需要校验 token，直接放行
    if (isPublic) {
      return true;
    }
    return false
  }
}
