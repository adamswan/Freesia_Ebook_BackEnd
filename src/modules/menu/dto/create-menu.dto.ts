import { IsInt, IsString } from "class-validator"

export class CreateMenuDto {
    // 路由路径
    @IsString()
    path: string

    // 路由名字
    @IsString()
    name: string

    // 路由重定向
    redirect: string | null

    // 路由元数据
    @IsString()
    meta: string

    // 子路由
    // 第一层路由没有父级,所以pid是0
    @IsInt()
    pid: number

    // 是否启用, 1表示已激活, 0表示未激活
    @IsInt()
    active: number
}
