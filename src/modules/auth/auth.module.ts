import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants'

@Module({
  controllers: [AuthController],

  providers: [
    AuthService,
    // Nest 将自动把 AuthGuard 绑定为全局守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],

  imports: [
    UserModule,
    // 配置 JWT
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // 私钥
      signOptions: {
        // 过期时间
        expiresIn: `${24 * 60 * 60}s`
      }
    })
  ]
})
export class AuthModule { }
