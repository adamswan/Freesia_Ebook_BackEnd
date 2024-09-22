import { ExceptionFilter, Catch, ArgumentsHost, HttpException, LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // 将错误信息放入日志文件，第1步：接收 winston 日志实例
  constructor(private winstonLoggerInstance: LoggerService) {
    // 
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 将错误信息放入日志文件，第2步：调用 error 方法，那么借助 winston-daily-rotate-file ,
    // 错误信息就会写入日志文件
    this.winstonLoggerInstance.error(exception.message)
    
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        api: request.url,
      });
  }
}