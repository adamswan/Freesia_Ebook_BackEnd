import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookSearch } from 'src/types/book';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
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
