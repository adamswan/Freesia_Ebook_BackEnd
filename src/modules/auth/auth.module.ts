import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';

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
  imports: [UserModule]
})
export class AuthModule {}
