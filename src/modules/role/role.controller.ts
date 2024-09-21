import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';
import { RoleSearch } from 'src/types/role';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
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
