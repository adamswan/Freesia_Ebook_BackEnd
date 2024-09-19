import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contents } from './entities/content.entity';
import { BookModule } from '../book/book.module';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService],
  imports: [TypeOrmModule.forFeature([Contents]), BookModule]
})
export class ContentsModule {}
