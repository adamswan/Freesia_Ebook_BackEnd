import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Public } from './public.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HttpExceptionFilter } from 'src/http-exception/http-exception';
import { UserLogin } from 'src/types/user';

@Controller('auth')
@UseFilters(HttpExceptionFilter) // 控制器级别的拦截器
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // 登录
  @Post('login')
  @Public() // 标识为公共接口，不需要校验 token
  login(@Body() params: UserLogin) {
   return this.authService.login(params.username, params.password)
  }

  // 注册
  @Post()
  register(@Body() createAuthDto: CreateAuthDto) {
    return '注册';
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
