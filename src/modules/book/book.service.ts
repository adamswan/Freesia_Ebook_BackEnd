import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  // 获取所有书
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

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
