import { Column, Entity, PrimaryColumn,  } from "typeorm";

@Entity('role_menu')
export class Role_Menu {
    @PrimaryColumn()
    roleId: number

    @PrimaryColumn()
    menuId: number
}
