import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) { }

  // 新增目录
  @Post()
  @UseInterceptors(FormattInterceptor)
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }

  // 删除目录
  @Delete(':id')
  @UseInterceptors(FormattInterceptor)
  remove(@Param('id') id: string) {
    return this.contentsService.remove(+id);
  }
}
