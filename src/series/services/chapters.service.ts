import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from '../schemas/chapter.schema';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { UpdateChapterDto } from '../dto/update-chapter.dto';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
  ) {}

  async createChapter(createChapterDto: CreateChapterDto) {
    const { volumeId, number } = createChapterDto;

    const existingChapter = await this.chapterModel.findOne({
      volumeId,
      number,
    });
    if (existingChapter) {
      throw new HttpException('Chapter already exists', HttpStatus.BAD_REQUEST);
    }

    return this.chapterModel.create(createChapterDto);
  }

  async getChapterById(chapterId: string) {
    return this.chapterModel.findById(chapterId).exec();
  }

  async updateChapter(chapterId: string, updateChapterDto: UpdateChapterDto) {
    return this.chapterModel
      .findByIdAndUpdate(chapterId, updateChapterDto, { new: true })
      .exec();
  }

  async deleteChapter(chapterId: string) {
    return this.chapterModel.findByIdAndDelete(chapterId).exec();
  }
}
