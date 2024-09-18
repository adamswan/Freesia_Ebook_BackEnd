import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('book')
export class Book {
    // todo：字段较多，应该分表的，后续优化
    @PrimaryGeneratedColumn()
    id: number

    // 文件名
    @Column()
    @Unique(['fileName'])
    fileName: string

    // 封面
    @Column()
    cover: string

    // 书名
    @Column()
    title: string

    // 作者
    @Column()
    author: string

    // 出版商
    @Column()
    publisher: string

    // 书的id
    @Column()
    bookId: string

    // 分类
    @Column()
    category: number

    // 分类描述
    @Column()
    categoryText: string

    // 语言
    @Column()
    language: string

    // 电子书的根文件地址
    @Column()
    rootFile: string

    // 原名
    @Column({ nullable: true })
    originName: string | null

    // 文件路径
    @Column({ nullable: true })
    filePath: string | null

    // 未压缩的文件路径
    @Column({ nullable: true })
    unzipPath: string | null

    // 封面路径
    @Column({ nullable: true })
    coverPath: string | null

    // 创建书的用户
    @Column({ nullable: true })
    createUser: string | null

    // 创建书的日期
    @Column({ nullable: true })
    createDT: number | null

    // 更新书的日期
    @Column({ nullable: true })
    updateDT: number| null

    // 更新类型
    @Column()
    updateType: number

}
