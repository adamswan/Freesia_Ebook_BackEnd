import { SetMetadata } from '@nestjs/common';
import { Role } from '../role-enum/role-enum';

// 给路由设定角色的元数据
export const ROLES_KEY = 'role';
export const Roles = (...roles: Role[]) => {
    console.log('...roles', SetMetadata(ROLES_KEY, roles))
   return SetMetadata(ROLES_KEY, roles); 
}