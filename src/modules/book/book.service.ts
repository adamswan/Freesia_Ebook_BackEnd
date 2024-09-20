import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs'
import * as path from 'path'
import { ParseEpubBook } from './ParseEpubBook';
import { zip } from 'compressing'

@Injectable()
export class BookService {
  constructor(
    //! 注入 user 表的存储库
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {

  }
  create(createBookDto: CreateBookDto) {
    return 'This action adds a new book';
  }

  // 查询所有符合筛选条件的书
  async findAll(queryObj) {
    let page = Number(queryObj.page) || 1 // 页码
    let pageSize = Number(queryObj.pageSize) || 10 // 要多少条数据

    const name = queryObj.name
    const author = queryObj.author

    // 兜底
    if (page <= 0) {
      page = 1
    }
    if (pageSize <= 0) {
      pageSize = 10
    }

    // 查询条件
    const searchObj = {
      where: {
        title: name ? Like(`%${name}%`) : Like(`%%`), // 根据书名查找, 支持模糊查询
        author: author ? Like(`%${author}%`) : Like(`%%`) // 根据作者查找, 支持模糊查询
      },
      skip: (page - 1) * pageSize, // 偏移量
      take: pageSize, // 每页数据条数
    }

    // 符合当前查询条件的数据总条数
    const totalNum = {
      where: {
        title: name ? Like(`%${name}%`) : Like(`%%`), // 根据书名查找, 支持模糊查询
        author: author ? Like(`%${author}%`) : Like(`%%`) // 根据作者查找, 支持模糊查询
      }
    }

    const res = await this.bookRepository.find(searchObj)
    const total = await this.bookRepository.count(totalNum)

    return {
      result: {
        res,
        total
      },
      message: '查询成功'
    };
  }

  // 获取单本书
  async findOne(id: number) {
    // 根据 id 查询单本书
    const res = await this.bookRepository.findOne({
      where: {
        id
      }
    })

    return {
      result: res,
      message: '查询成功'
    };
  }

  // 上传电子书
  async handleUploadBook(file: Express.Multer.File) {
    // console.log('file', file);

    const originalname = file.originalname // 文件原始名称
    const mimetype = file.mimetype // 文件媒体格式
    const size = file.size // 文件大小

    // Nginx 的静态资源目录
    const nginxStaticPath = 'E:/Nginx/html/uploadFile'

    // 绝对路径
    const absPath = path.resolve(nginxStaticPath, originalname)

    // 同步写入文件
    fs.writeFileSync(absPath, file.buffer)

    // 解析 epub 电子书
    const parser = new ParseEpubBook(absPath, file)
    const res = await parser.toParse()

    return {
      code: 0,
      result: {
        originalname,
        mimetype,
        size,
        path: absPath,
        bookInfo_and_content: res
      },
      message: '上传成功'
    }
  }

  // 新增电子书
  async addNewBook(data: CreateBookDto) {
    // 1. 创建一个实体对象
    const newBook = new Book()

    // 2. 向实体对象上添加属性
    newBook.fileName = data.fileName
    newBook.cover = data.coverPath
    newBook.title = data.title
    newBook.author = data.author
    newBook.publisher = data.publisher
    newBook.bookId = data.fileName
    newBook.category = data.category
    newBook.categoryText = '未知'
    newBook.language = data.language
    newBook.rootFile = data.rootFile
    newBook.originName = data.originName
    newBook.filePath = data.filePath
    newBook.unzipPath = '未知路径'
    newBook.coverPath = data.coverPath
    newBook.updateType = 0

    // 3. 入表
    const res = await this.bookRepository.save(newBook)

    return {
      result: res,
      message: '新增成功'
    }
  }

  // 更新电子书
  async update(id: number, data: UpdateBookDto) {
    const res = await this.bookRepository.update(id, data)
    return {
      result: res,
      message: '更新成功'
    };
  }

  // 删除电子书
  async remove(id: number) {
    const res = await this.bookRepository.delete(id)
    return {
      result: res,
      message: '删除成功'
    };
  }

  // 下载电子书（流式下载）
  async downloadByBinary(id, res) {
    //! step 1. 创建zip压缩的流对象
    const stream = new zip.Stream()

    // ! step 2. 获取电子书的绝对路径
    // 先获取id对应的电子书文件名
    const { fileName } = await this.bookRepository.findOne({
      where: {
        id
      }
    })
    // Nginx 的静态资源目录
    const nginxStaticPath = 'E:/Nginx/html/uploadFile'
    // 电子书的绝对路径
    const fileAbsPath = path.resolve(nginxStaticPath, fileName)

    // ! step 3. 将目标文件转换为zip压缩格式个二进制数据
    await stream.addEntry(fileAbsPath)

    // ! step 4. 响应对象设置响应头
    res.setHeader('Content-Type', 'application/octet-stream') // 响应内容
    res.setHeader('Content-Disposition', 'attachment;filename=EPUBBOOK') // 附加信息

    //! step 5. pipe() 方法，将流文件返回出去
    stream.pipe(res)
  }
}
