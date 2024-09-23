import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';
import { RoleSearch } from 'src/types/role';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  // 关联角色与菜单
  @Post('/linkedMenu')
  @UseInterceptors(FormattInterceptor)
  link_Role_Menu(@Query('roleID') roleID, @Query('menuID') menuID) {
    return this.roleService.link_Role_Menu(+roleID, +menuID);
  }

  // 更新关联角色与菜单
  @Post('/linkedMenu/update')
  @UseInterceptors(FormattInterceptor)
  link_Role_Menu_Update(@Query('roleID') roleID, @Query('menuID') menuID) {
    return this.roleService.link_Role_Menu_Update(+roleID, +menuID);
  }

  // 更新关联角色与功能权限
  @Post('/linkedAuth/update')
  @UseInterceptors(FormattInterceptor)
  link_Role_Auth_Update(@Query('roleID') roleID, @Query('menuID') menuID) {
    return this.roleService.link_Role_Auth_Update(+roleID, +menuID);
  }

  // 查询当前角色已绑定的菜单列表
  @Get('/linkedMenu/list/:id')
  @UseInterceptors(FormattInterceptor)
  getListOf_Role_Menu(@Param('id') id) {
    return this.roleService.getListOf_Role_Menu(+id);
  }

  // 删除已存在的角色和菜单的绑定关系
  @Delete('/linkedMenu/:id')
  @UseInterceptors(FormattInterceptor)
  deleteAlreadyExistRoleMenu(@Param('id') id) {
    return this.roleService.deleteAlreadyExistRoleMenu(+id);
  }

  // 删除已存在的角色和功能权限的绑定关系
  @Delete('/linkedAuth/:id')
  @UseInterceptors(FormattInterceptor)
  deleteAlreadyExistRoleAuth(@Param('id') id) {
    return this.roleService.deleteAlreadyExistRoleAuth(+id);
  }

  // 根据角色名，查询功能权限的字段
  @Post('getAuthByRole')
  @UseInterceptors(FormattInterceptor)
  getAuthByRole(@Body('roles') roles: string) {
    return this.roleService.getAuthByRole(roles);
  }

  // 新增角色
  @Post()
  @UseInterceptors(FormattInterceptor)
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data);
  }

  // 获取角色, 支持条件查询
  @Get()
  @UseInterceptors(FormattInterceptor)
  findAll(@Query() queryObj: RoleSearch) {
    return this.roleService.findAll(queryObj);
  }

  // 更新角色
  @Post(':id')
  @UseInterceptors(FormattInterceptor)
  update(@Param('id') id: string, @Body() data: UpdateRoleDto) {
    const oData = {
      name: data.name,
      remark: data.remark
    }
    return this.roleService.update(+id, oData);
  }

  // 删除角色
  @Delete(':id')
  @UseInterceptors(FormattInterceptor)
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
