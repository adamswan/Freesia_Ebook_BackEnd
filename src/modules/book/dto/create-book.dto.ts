export class CreateBookDto {
    // 文件名
    fileName: string

    // 封面
    cover: string

    // 书名
    title: string

    // 作者
    author: string

    // 出版商
    publisher: string

    // 书的id
    bookId?: string

    // 分类
    category: number

    // 分类描述
    categoryText: string

    // 语言
    language: string

    // 电子书的根文件地址
    rootFile: string

    // 原名
    originName: string | null

    // 文件路径
    filePath: string | null

    // 未压缩的文件路径
    unzipPath: string | null

    // 封面路径
    coverPath: string | null

    // 创建书的用户
    createUser?: string | null

    // 创建书的日期
    createDT?: number | null

    // 更新书的日期
    updateDT?: number | null

    // 更新类型
    updateType?: number

}
