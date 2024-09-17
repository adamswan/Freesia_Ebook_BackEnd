import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put, Query, ParseIntPipe } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';


@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // 创建新菜单
  @Post()
  @UseInterceptors(FormattInterceptor)
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  // 获取用户已激活的菜单
  @Get('active')
  @UseInterceptors(FormattInterceptor)
  getActiveMenu() {
    return this.menuService.findActive();
  }

  // 获取用户具有的所有菜单
  @Get()
  @UseInterceptors(FormattInterceptor)
  getAllMenu() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  // 更新菜单
  @Put(':id')
  @UseInterceptors(FormattInterceptor)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  // 删除
  @Delete(':id')
  @UseInterceptors(FormattInterceptor)
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
