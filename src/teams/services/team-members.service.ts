import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember, TeamRoles } from '../schemas/team-member.schema';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectModel(TeamMember.name) private teamMemberModel: Model<TeamMember>,
  ) {}

  async findTeams(userId: string, page: number, limit: number) {
    const total = await this.teamMemberModel.countDocuments({ userId });
    const results = await this.teamMemberModel
      .find({ userId })
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

  async addMember(
    teamId: string,
    userId: string,
    role: TeamRoles = TeamRoles.MEMBER,
  ) {
    return this.teamMemberModel.create({ teamId, userId, role });
  }

  async hasSomeTeam(userId: string) {
    const teams = await this.teamMemberModel.find({ userId });

    return teams.length > 0;
  }

  async getMembersByTeam(teamId: string) {
    return this.teamMemberModel.find({ teamId }).populate('userId').exec();
  }

  async getMemberByTeamAndUser(teamId: string, userId: string) {
    return this.teamMemberModel.findOne({ teamId, userId }).exec();
  }

  async removeMember(teamId: string, userId: string) {
    return this.teamMemberModel.findOneAndDelete({ teamId, userId }).exec();
  }
}
