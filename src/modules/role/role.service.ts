import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Like, Repository } from 'typeorm';
import { UpdateRole } from 'src/types/role';

@Injectable()
export class RoleService {
  constructor(
    //! 注入 role 表的存储库
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    // 
  }

  async create(data: CreateRoleDto) {
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

  findOne(id: number) {
    return `This action returns a #${id} role`;
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
    const res = await this.roleRepository.delete(id)
    return {
      result: res,
      message: "删除成功"
    }
  }
}
