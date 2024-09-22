import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Role_Auth } from './entities/role_auth.entity';

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
    TypeOrmModule.forFeature([Auth, Role_Auth]),
    // 配置 JWT
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // 私钥
      signOptions: {
        // 过期时间
        expiresIn: `${72 * 60 * 60}s`
      }
    })
  ],

  exports: [AuthService]
})
export class AuthModule { }
