import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseInterceptors, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { UserLogin } from 'src/types/user';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';
import { AuthSearch } from 'src/types/auth';
import { AddNewAuthDto } from './dto/add-new-auth.dto';

@Controller('auth')
// @UseFilters(HttpExceptionFilter) // 控制器级别的拦截器
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // 登录
  @Post('login')
  @Public() // 标识为公共接口，不需要校验 token
  @UseInterceptors(FormattInterceptor)
  login(@Body() params: UserLogin) {
    return this.authService.login(params.username, params.password)
  }

  // 获取权限列表
  @Get()
  @UseInterceptors(FormattInterceptor)
  findAll(@Query() queryObj: AuthSearch) {
    return this.authService.findAll(queryObj);
  }

  // 新增权限
  @Post()
  @UseInterceptors(FormattInterceptor)
  addNewAuth(@Body() data: AddNewAuthDto) {
    return this.authService.addAuthd(data);
  }

  // 绑定角色和权限
  @Post('linkRoleAndAuth')
  @UseInterceptors(FormattInterceptor)
  linkRoleAndAuth(@Query('roleId') roleId: string, @Query('authId') authId: string) {
    return this.authService.linkRoleAndAuth(+roleId, +authId);
  }

  // 查询roleId对应的功能权限
  @Get('linkedAuth/list')
  @UseInterceptors(FormattInterceptor)
  findAuthByID(@Query('roleId') roleId: string) {
    return this.authService.findAuthByID(+roleId);
  }

  // 编辑权限
  @Post(':id')
  @UseInterceptors(FormattInterceptor)
  update(@Param('id') id: string, @Body() data: AddNewAuthDto) {
    return this.authService.update(+id, data);
  }

  // 删除权限
  @Delete(':id')
  @UseInterceptors(FormattInterceptor)
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
