import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseFilters, Request, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/http-exception/http-exception';
import { PayloadOfRequest } from 'src/types/user';
import { FormattInterceptor } from 'src/formatt-interceptor/formatt.interceptor';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) { }

  // 新增用户
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 查询所有用户
  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }

  // 获取用户资料
  // 在 auth.guard.ts 中，已经payload添加到了请求对象上
  @Get('info')
  @UseInterceptors(FormattInterceptor) // 使用响应拦截器格式化响应数据
  getUserInfoByToken(@Request() requestObj: PayloadOfRequest) {
    return this.userService.getUserInfoByToken(requestObj.username)
  }

  // 查询单个用户
  @Get(':id')
  findUser(
    // 提取路径参数，并用管道转换为 number 型
    @Param('id', ParseIntPipe) id
  ) {
    return this.userService.findOne(id);
  }

  // 删除指定用户
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // 更新用户
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
