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

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentsService.update(+id, updateContentDto);
  }

  // 删除目录
  @Delete(':id')
  @UseInterceptors(FormattInterceptor)
  remove(@Param('id') id: string) {
    return this.contentsService.remove(+id);
  }
}
