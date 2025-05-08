import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Volume } from '../schemas/volume.schema';
import { CreateVolumeDto } from '../dto/create-volume.dto';
import { UpdateVolumeDto } from '../dto/update-volume.dto';

@Injectable()
export class VolumesService {
  constructor(
    @InjectModel(Volume.name) private readonly volumeModel: Model<Volume>,
  ) {}

  async createVolume(createVolumeDto: CreateVolumeDto) {
    const { seriesId, number } = createVolumeDto;

    const existingVolume = await this.volumeModel.findOne({
      seriesId,
      number,
    });
    if (existingVolume) {
      throw new HttpException('Volume already exists', HttpStatus.BAD_REQUEST);
    }

    return this.volumeModel.create(createVolumeDto);
  }

  async getVolumeById(volumeId: string) {
    return this.volumeModel.findById(volumeId).exec();
  }

  async updateVolume(volumeId: string, updateVolumeDto: UpdateVolumeDto) {
    return this.volumeModel
      .findByIdAndUpdate(volumeId, updateVolumeDto, { new: true })
      .exec();
  }

  async deleteVolume(volumeId: string) {
    return this.volumeModel.findByIdAndDelete(volumeId).exec();
  }
}
