import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata";
import { createLogger } from 'winston';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file'
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  // 1、创建实例
  const instance = createLogger({
    // winston 日志的配置参数
    transports: [
      // a. 显示到 node 终端中的日志
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),

      // b. 记录到服务端硬盘的日志
      new winston.transports.DailyRotateFile({
        level: 'warn', // 只将 error、warn类型的日志记录在硬盘中
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
        dirname: 'logs', // 生产环境下,这将会是个静态目录,专门存放log文件
        filename: 'info-%DATE%.log', // 日志文件的名字
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });

  const winstonLoggerInstance: LoggerService = WinstonModule.createLogger({
    instance,
  });

  const app = await NestFactory.create(AppModule, {
    cors: true, // 开启跨域资源共享
    // 2、覆盖 Nest 自带的日志
    logger: winstonLoggerInstance,
  });

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter(winstonLoggerInstance));
  
  await app.listen(3000);
}
bootstrap();
