import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Role_Menu } from './entities/role_menu.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([Role, Role_Menu]), AuthModule]
})
export class RoleModule { }
