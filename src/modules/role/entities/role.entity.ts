import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Unique(['name'])
    name: string

    @Column()
    remark: string
}
