import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.develop' }); // 加载指定环境变量

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    AuthModule,
    BookModule,
    // 配置 TypeOrm
    TypeOrmModule.forRoot({
      type: "mysql", // 数据库类型
      username: `${process.env.TYPEORM_USERNAME}`, // 账号
      password: `${process.env.TYPEORM_PASSWORD}`, // 密码
      host: `${process.env.TYPEORM_HOST}`, // host
      port: Number(process.env.TYPEORM_PORT), //
      database: `${process.env.TYPEORM_DATABASE}`, //库名
      synchronize: true, // synchronize字段代表是否自动将实体类同步到数据库
      retryDelay: 500, // 重试连接数据库间隔
      retryAttempts: 10,// 重试连接数据库的次数
      //! 如果为true, 将自动加载实体, forFeature() 方法注册的每个实体都将自动添加到配置对象的实体数组中
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule { }
