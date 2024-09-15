import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    // 引入实体文件
    TypeOrmModule.forFeature([User])
  ],
  exports: [UserService]
})

export class UserModule {}
