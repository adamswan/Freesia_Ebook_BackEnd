import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MenuService {

  constructor(
    @InjectRepository(Menu) // 必须使用 InjectRepository 装饰这个参数, 它才能使用存储库
    private readonly menuRepository: Repository<Menu>
  ) {

  }

  async create(createMenuDto: CreateMenuDto) {
    const newMenu = new Menu()
    newMenu.path = createMenuDto.path
    newMenu.name = createMenuDto.name
    newMenu.redirect = createMenuDto.redirect
    newMenu.pid = createMenuDto.pid
    // newMenu.meta = JSON.stringify(createMenuDto.meta)
    newMenu.meta = createMenuDto.meta
    newMenu.active = createMenuDto.active

    const res = await this.menuRepository.save(newMenu)
    return {
      result: res
    }
  }

  // 获取用户已激活的菜单
  async findActive() {
    const allMenu = await this.menuRepository.findBy({ active: 1 })

    return {
      result: allMenu
    }
  }

  // 获取用户具有的所有菜单
  async findAll() {
    // return {
    //   result: `[{"path":"/about","name":"About","redirect":"/about/index","meta":{"hideChildrenInMenu":true,"icon":"simple-icons:about-dot-me","title":"routes.dashboard.about","orderNo":100000},"children":[{"path":"index","name":"AboutPage","meta":{"title":"routes.dashboard.about","icon":"simple-icons:about-dot-me","hideMenu":true}}]},{"path":"/dashboard","name":"Dashboard","redirect":"/dashboard/analysis","meta":{"orderNo":10,"icon":"ion:grid-outline","title":"routes.dashboard.dashboard"},"children":[{"path":"analysis","name":"Analysis","meta":{"title":"routes.dashboard.analysis"}},{"path":"workbench","name":"Workbench","meta":{"title":"routes.dashboard.workbench"}}]},{"path": "/charts",
    //     "name": "Charts",
    //   "redirect": "/charts/echarts/map",
    //   "meta": {
    //     "orderNo": 500,
    //     "icon": "ion:bar-chart-outline",
    //     "title": "routes.demo.charts.charts"
    //   },
    //   "children": [
    //     {
    //       "path": "baiduMap",
    //       "name": "BaiduMap",
    //       "meta": {
    //         "title": "routes.demo.charts.baiduMap"
    //       }
    //     },
    //     {
    //       "path": "aMap",
    //       "name": "AMap",
    //       "meta": {
    //         "title": "routes.demo.charts.aMap"
    //       }
    //     },
    //     {
    //       "path": "googleMap",
    //       "name": "GoogleMap",
    //       "meta": {
    //         "title": "routes.demo.charts.googleMap"
    //       }
    //     },
    //     {
    //       "path": "echarts",
    //       "name": "Echarts",
    //       "meta": {
    //         "title": "Echarts"
    //       },
    //       "redirect": "/charts/echarts/map",
    //       "children": [
    //         {
    //           "path": "map",
    //           "name": "Map",
    //           "meta": {
    //             "title": "routes.demo.charts.map"
    //           }
    //         },
    //         {
    //           "path": "line",
    //           "name": "Line",
    //           "meta": {
    //             "title": "routes.demo.charts.line"
    //           }
    //         },
    //         {
    //           "path": "pie",
    //           "name": "Pie",
    //           "meta": {
    //             "title": "routes.demo.charts.pie"
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //     "path": "/permission",
    //     "name": "Permission",
    //     "redirect": "/permission/menu",
    //     "meta": {"orderNo":15,"icon":"ion:key-outline","title":"routes.demo.permission.permission"},
    //     "children": [
    //         {
    //             "path": "menu",
    //             "name": "PermissionMenu",
    //             "meta": {"title": "routes.demo.permission.menu"}
    //         }
    //     ]
    // }]`,
    //   message: '获取菜单成功'
    // };

    // 获取所有已经激活的菜单
    const allMenu = await this.menuRepository.find()

    return {
      result: allMenu
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  // 更新菜单
  async update(id, updateMenuDto: UpdateMenuDto) {
    const res = await this.menuRepository.update(id, updateMenuDto)
    return {
      result: res,
      message: '更新成功'
    };
  }

  async remove(id: number) {
    const res = await this.menuRepository.delete(id);
    return {
      result: res,
      message: '删除成功'
    }

  }
}
