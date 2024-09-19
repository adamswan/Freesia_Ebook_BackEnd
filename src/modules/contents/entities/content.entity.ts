import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity('contents')
export class Contents {
    @PrimaryGeneratedColumn()
    id: number

    // 就是电子书的文件名，fileName唯一
    @Column()
    fileName: string

    @Column()
    charterId: string

    @Column()
    href: string

    @Column()
    order: number

    @Column()
    level: number

    @Column()
    text: string

    @Column()
    label: string

    @Column()
    pid: string

    @Column()
    navId: string
}
