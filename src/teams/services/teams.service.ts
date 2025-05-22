import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from '../schemas/team.schema';
import { UpdateTeamDto } from '../dto/update-teams.dto';
import { CreateTeamDto } from '../dto/create-teams.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  async findTeams(filters: any, page: number, limit: number) {
    const query: any = {};

    if (filters.name) query.name = { $regex: new RegExp(filters.name, 'i') };
    if (filters.identifier)
      query.identifier = { $regex: new RegExp(filters.identifier, 'i') };

    const total = await this.teamModel.countDocuments(query);
    const results = await this.teamModel
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

  async createTeam(data: CreateTeamDto) {
    return this.teamModel.create(data);
  }

  async getTeam(where: { name?: string; publicName?: string }) {
    return this.teamModel.findOne(where).exec();
  }

  async getTeamById(teamId: string) {
    return this.teamModel.findById(teamId).exec();
  }

  async updateTeam(teamId: string, updateData: UpdateTeamDto) {
    return this.teamModel
      .findByIdAndUpdate(teamId, updateData, { new: true })
      .exec();
  }

  async deleteTeam(teamId: string) {
    return this.teamModel.findByIdAndDelete(teamId).exec();
  }
}
