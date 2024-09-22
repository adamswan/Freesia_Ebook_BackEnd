import {  Entity, PrimaryColumn } from "typeorm";

@Entity('role_auth')
export class Role_Auth {
    @PrimaryColumn()
    roleId: number

    @PrimaryColumn()
    authId: number
}
