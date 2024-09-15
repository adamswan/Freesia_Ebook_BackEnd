import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }); // 开启跨域资源共享
  await app.listen(3000);
}
bootstrap();
