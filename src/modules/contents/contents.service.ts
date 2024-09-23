import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contents } from './entities/content.entity'
import { Repository } from 'typeorm';
import { BookService } from '../book/book.service';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Contents)
    private readonly contentsRepository: Repository<Contents>,

    // 服务共享
    private bookService: BookService,
  ) {
    // 
  }

  // 新增目录
  async create(data: CreateContentDto) {
    const newContents = new Contents()

    newContents.fileName = data.fileName
    newContents.charterId = data.charterId
    newContents.href = data.href
    newContents.order = data.order
    newContents.level = data.level
    newContents.text = data.text
    newContents.label = data.label
    newContents.pid = data.pid
    newContents.navId = data.navId

    const res = await this.contentsRepository.save(newContents)

    return {
      result: res,
      message: '新增目录成功'
    };
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  async remove(id: number) {
    // 用 book 的服务获取电子书的名字
    const res = await this.bookService.findOne(id)
    const targetEpubName = res.result.fileName
    // 根据名字删除该书对应的所有目录
    const result = await this.contentsRepository.delete({ fileName: targetEpubName })
    return {
      result,
      message: '删除成功'
    };
  }
}
