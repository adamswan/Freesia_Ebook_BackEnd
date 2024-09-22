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

    @Column({ nullable: true })
    role: string | null

    @Column({ nullable: true })
    avatar: string | null

    @Column({ nullable: true })
    nickname: string | null

    @Column({ nullable: true })
    active: number | null
}
