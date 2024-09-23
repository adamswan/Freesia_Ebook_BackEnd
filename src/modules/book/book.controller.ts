import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipeBuilder, Res, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookSearch } from 'src/types/book';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '../role/role-enum/role-enum';
import { Roles } from '../role/decorator/role.decorator';
import { RolesGuard } from '../role/role-guard/roles.guard';


@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  // 新增电子书
  @Post()
  @UseInterceptors(FormattInterceptor)
  addNewBook(@Body() data: CreateBookDto) {
    return this.bookService.addNewBook(data)
  }

  // 上传电子书
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadBook(@UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'epub' }).build()) file: Express.Multer.File) {
    return this.bookService.handleUploadBook(file)
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

  // 更新电子书
  @Post('update/:id')
  @UseInterceptors(FormattInterceptor)
  update(@Param('id') id: string, @Body() data: UpdateBookDto) {
    return this.bookService.update(+id, data);
  }

  // 删除电子书
  @Delete(':id')
  @UseInterceptors(FormattInterceptor)
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }

  // 下载电子书
  // 举例：只有超级管理员（super）才能下载电子书
  @Get('download/:id')
  // @Roles(Role.Super) // @Roles 是自定义装饰器，将该路由标记为只有超级管理员特有
  // @UseGuards(RolesGuard) // @UseGuards(RolesGuard) 角色守卫，定义只有管理员才有权限调用这个路由
  downloadByBinary(@Param('id') id, @Res() res) {
    return this.bookService.downloadByBinary(+id, res)
  }
}
