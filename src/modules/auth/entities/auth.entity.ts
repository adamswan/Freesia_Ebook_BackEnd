import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('auth')
export class Auth {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    key: string
    
    @Column()
    name: string

    @Column()
    remark: string
}
