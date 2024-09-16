import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('menu')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number

    // 路由路径
    @Column()
    path: string

    // 路由名字
    @Column()
    @Unique(['name'])
    name: string

    // 路由重定向
    @Column({ nullable: true })
    redirect: string | null

    // 路由元数据
    @Column()
    meta: string

    // 子路由
    // 第一层路由没有父级,所以pid是0
    @Column()
    pid: number

    // 是否启用, 1表示已激活, 0表示未激活
    @Column({
        default: 1 // 默认为1
    })
    active: number



}
