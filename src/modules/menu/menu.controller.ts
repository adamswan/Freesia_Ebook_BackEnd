import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
