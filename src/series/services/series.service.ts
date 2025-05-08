import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Serie } from '../schemas/serie.schema';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateSeriesDto } from '../dto/update-series.dto';

@Injectable()
export class SeriesService {
  constructor(@InjectModel(Serie.name) private seriesModel: Model<Serie>) {}

  async findSeries(filters: any, page: number, limit: number) {
    const query: any = {};

    if (filters.title) query.title = { $regex: new RegExp(filters.title, 'i') };
    if (filters.tags) query.tags = { $in: filters.tags };
    if (filters.demography) query.demography = filters.demography;
    if (filters.genres) query.genres = { $in: filters.genres };
    if (filters.state) query.state = filters.state;
    if (filters.format) query.format = filters.format;
    if (filters.authors) query.authors = { $in: filters.authors };
    if (filters.artists) query.artists = { $in: filters.artists };

    const total = await this.seriesModel.countDocuments(query);
    const results = await this.seriesModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      results,
    };
  }

  async createSerie(
    seriesData: CreateSeriesDto & { icon: string },
    userId: string,
  ) {
    return this.seriesModel.create({ ...seriesData, ownerId: userId });
  }

  async getSerieById(seriesId: string) {
    return this.seriesModel.findById(seriesId).exec();
  }

  async updateSerie(
    seriesId: string,
    updateData: UpdateSeriesDto & { icon?: string },
  ) {
    return this.seriesModel
      .findByIdAndUpdate(seriesId, updateData, { new: true })
      .exec();
  }
}
