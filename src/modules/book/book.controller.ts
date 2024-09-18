import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookSearch } from 'src/types/book';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs'
import * as path from 'path'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  // 上传电子书
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadBook(@UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'epub' }).build()) file: Express.Multer.File) {

    console.log('file', file);

    const originalname = file.originalname // 文件原始名称
    const mimetype = file.mimetype // 文件媒体格式
    const size = file.size // 文件大小

    // Nginx 的静态资源目录
    const nginxStaticPath = 'E:/Nginx/html/uploadFile'
    // 绝对路径
    const absPath = path.resolve(nginxStaticPath, originalname)
    // 同步写入文件
    fs.writeFileSync(absPath, file.buffer)

    return {
      code: 0,
      result: {
        originalname,
        mimetype,
        size,
        path: absPath
      },
      message: '上传成功'
    }
  }

  // 获取所有书
  @Get()
  @UseInterceptors(FormattInterceptor) // 使用响应拦截器格式化响应数据
  findBookList(@Query() queryObj: BookSearch) {
    return this.bookService.findAll(queryObj);
  }

  // 获取单本书
  @Get(':id')
  @UseInterceptors(FormattInterceptor) // 使用响应拦截器格式化响应数据
  findOneBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
