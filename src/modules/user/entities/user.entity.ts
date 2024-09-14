import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity('user') // name 表示数据库中的表名
export class User {
    @PrimaryGeneratedColumn() // id 是一个自增的主键
    id: number

    @Column()
    @Unique(['username']) // username 是唯一的
    username: string

    @Column()
    password: string

    @Column()
    role: string

    @Column()
    avatar: string

    @Column()
    nickname: string

    @Column()
    active: number
}
