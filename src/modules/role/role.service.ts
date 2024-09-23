import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Like, Repository } from 'typeorm';
import { UpdateRole } from 'src/types/role';
import { Role_Menu } from './entities/role_menu.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RoleService {
  constructor(
    //! 注入 Role 表的存储库
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Role_Menu)
    private readonly roleMenuRepository: Repository<Role_Menu>,

    private readonly authService: AuthService

  ) {
    // 
  }

  async create(data: CreateRoleDto) {
    const role = await this.roleRepository.find({ where: { name: data.name } })
    if (role.length !== 0) {
      // 禁止注册同名角色
      throw new HttpException({
        code: HttpStatus.BAD_REQUEST,
        errorMSG: '已存在相同角色名',
      }, HttpStatus.BAD_REQUEST);
    }

    const newRole = new Role()
    newRole.name = data.name
    newRole.remark = data.remark
    const res = await this.roleRepository.save(newRole)
    return {
      result: res,
      message: "添加成功"
    }
  }

  // 查询角色
  async findAll(queryObj) {
    let page = Number(queryObj.page) || 1 // 页码
    let pageSize = Number(queryObj.pageSize) || 10 // 要多少条数据
    // 兜底
    if (page <= 0) {
      page = 1
    }
    if (pageSize <= 0) {
      pageSize = 10
    }

    const id = queryObj.id
    const name = queryObj.name

    const searchObj: any = {
      where: {
        id: id ? Like(`%${id}%`) : Like(`%%`),
        name: name ? Like(`%${name}%`) : Like(`%%`)
      },
      skip: (page - 1) * pageSize, // 偏移量
      take: pageSize, // 每页数据条数
    }

    const roleList = await this.roleRepository.find(searchObj);

    return {
      result: roleList,
      message: '查询成功'
    }
  }

  async update(id: number, data: UpdateRoleDto) {
    const oData = {} as UpdateRole
    oData.name = data.name
    oData.remark = data.remark
    const res = await this.roleRepository.update(id, data)
    return {
      result: res,
      message: "更新成功"
    }
  }

  async remove(id: number) {
    // 先删角色与菜单权限的绑定关系，
    await this.roleMenuRepository.delete({ roleId: id })
    // 再删角色与功能权限的绑定关系，
    await this.authService.unlinkRoleAndAuth(id)
    // 最后删除角色本身
    const res = await this.roleRepository.delete(id)
    return {
      result: res,
      message: "删除成功"
    }
  }

  // 关联角色与菜单
  async link_Role_Menu(roleID: number, menuID: number) {
    const newBindings = new Role_Menu()
    newBindings.roleId = roleID
    newBindings.menuId = menuID
    const res = await this.roleMenuRepository.save(newBindings)
    return {
      result: res,
      message: '绑定成功'
    }
  }

  // 更新关联角色与菜单
  async link_Role_Menu_Update(roleID: number, menuID: number) {
    const newBindings = new Role_Menu()
    newBindings.roleId = roleID
    newBindings.menuId = menuID
    const res = await this.roleMenuRepository.save(newBindings)
    return {
      result: res,
      message: '更新成功'
    }
  }

  // 更新关联角色与功能权限
  async link_Role_Auth_Update(roleID: number, menuID: number) {
    const res = await this.authService.linkRoleAndAuth(roleID, menuID)
    return {
      result: res,
      message: '更新成功'
    }
  }

  // 解除角色与菜单的绑定关系
  async deleteAlreadyExistRoleMenu(roleID: number) {
    const res = await this.roleMenuRepository.delete({ roleId: roleID })
    return {
      result: res,
      message: '删除成功'
    }
  }

  // 解除角色和功能权限的关系
  async deleteAlreadyExistRoleAuth(roleID: number) {
    const res = await this.authService.unlinkRoleAndAuth(roleID)
    return {
      result: res,
      message: '删除成功'
    }
  }

  // 查询角色和菜单的绑定关系
  async getListOf_Role_Menu(id) {
    const res = await this.roleMenuRepository.find({
      where: {
        roleId: id
      }
    })
    return {
      result: res,
      message: '查询成功'
    }
  }

  // 根据角色名，查询功能权限的字段
  async getAuthByRole(roles: string) {
    let arr = JSON.parse(roles)

    //!! step 1. 查找角色id
    const roleIds = []
    for (let i = 0; i < arr.length; i++) {
      const resArr = await this.roleRepository.findBy({
        name: arr[i]
      })
      roleIds.push(resArr[0]?.id)
    }

    //!! step 2. 根据角色id 查询对应的功能权限
    let authIds = []
    for (let i = 0; i < roleIds.length; i++) {
      const arr = await this.authService.findAuthByID(roleIds[i])
      if (arr.result.length !== 0) {
        let authIdPart = arr.result.map(e => e.authId)
        authIds.push(...authIdPart)
      }
    }
    // 多个角色的功能权限可能相同，所以汇聚到一个用户上的功能权限会重复，故去重
    authIds = [...new Set(authIds)]

    // !! step 3. 根据功能权限id，查询权限标识
    let authMarks = []
    for (let i = 0; i < authIds.length; i++) {
      const arr = await this.authService.findAuthMarkById(authIds[i])
      authMarks.push(...arr.map(e => e.key))
    }

    return {
      result: authMarks,
      message: '查询成功'
    }
  }
}
