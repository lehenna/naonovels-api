import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../schemas/users.schema';
import { CreateUserDto } from '../dto/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(filters: any, page: number, limit: number) {
    const query: any = {};

    if (filters.name) query.name = { $regex: new RegExp(filters.name, 'i') };
    if (filters.identifier)
      query.identifier = { $regex: new RegExp(filters.identifier, 'i') };

    const total = await this.userModel.countDocuments(query);
    const results = await this.userModel
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

  async findByIdentifier(identifier: string): Promise<User | null> {
    return this.userModel.findOne({ identifier }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async update(
    teamId: string,
    updateData: { name?: string; description?: string; icon?: string },
  ) {
    return this.userModel
      .findByIdAndUpdate(teamId, updateData, { new: true })
      .exec();
  }
}
