import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { TeamMembersService } from '../services/team-members.service';
import { TeamInvitationsService } from '../services/team-invitations.service';
import { TeamRoles } from '../schemas/team-member.schema';
import { UploadsService } from '@/common/services/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTeamDto } from '../dto/create-teams.dto';
import { UpdateTeamDto } from '../dto/update-teams.dto';
import { Public } from '@/common/lib/decorators';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamMembersService: TeamMembersService,
    private readonly teamInvitationsService: TeamInvitationsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Public()
  @Get()
  async listTeams(
    @Query('name') name?: string,
    @Query('identifier') identifier?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filters = {
      identifier,
      name,
    };
    return this.teamsService.findTeams(filters, Number(page), Number(limit));
  }

  @Get('user')
  async listUserTeams(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.teamMembersService.findTeams(
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  async createTeam(
    @Body() { name, publicName }: CreateTeamDto,
    @Req() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    name = name.toLowerCase().trim();

    const teamExists = await this.teamsService.getTeam({ name });
    if (teamExists)
      throw new HttpException(
        'Identifier already in use.',
        HttpStatus.BAD_REQUEST,
      );

    const data: CreateTeamDto = {
      name: name,
      publicName,
    };

    if (file) {
      const fileName = await this.uploadsService.saveImage(file);
      data.icon = fileName;
    }

    const team = await this.teamsService.createTeam(data);

    await this.teamMembersService.addMember(team.id, userId, TeamRoles.OWNER);

    return team;
  }

  @Public()
  @Get(':teamId')
  async getTeam(@Param('teamId') teamId: string) {
    return this.teamsService.getTeamById(teamId);
  }

  @Delete(':teamId')
  async deleteTeam(@Param('teamId') teamId: string, @Req() req) {
    const userId = req.user.id;
    const member = await this.teamMembersService.getMemberByTeamAndUser(
      teamId,
      userId,
    );

    if (!member || member.role !== TeamRoles.OWNER)
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    return this.teamsService.deleteTeam(teamId);
  }

  @Patch(':teamId')
  @UseInterceptors(FileInterceptor('icon'))
  async updateTeam(
    @Param('teamId') teamId: string,
    @Body() teamData: UpdateTeamDto,
    @Req() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const member = await this.teamMembersService.getMemberByTeamAndUser(
      teamId,
      userId,
    );

    if (
      !member ||
      (member.role !== TeamRoles.ADMIN && member.role !== TeamRoles.OWNER)
    )
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    if (teamData.name) {
      teamData.name = teamData.name.toLowerCase().trim();
      const teamExists = await this.teamsService.getTeam({
        name: teamData.name,
      });
      if (teamExists)
        throw new HttpException(
          'Identifier already in use.',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (file) {
      const fileName = await this.uploadsService.saveImage(file);
      teamData.icon = fileName;
    }

    return this.teamsService.updateTeam(teamId, teamData);
  }

  @Post(':teamId/members')
  async addMember(
    @Param('teamId') teamId: string,
    @Body() { userId, role }: { userId: string; role: TeamRoles },
  ) {
    return this.teamMembersService.addMember(teamId, userId, role);
  }

  @Patch(':teamId/members/:userId')
  async updateMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Body() { role }: { role: TeamRoles },
    @Req() req,
  ) {
    const requesterId = req.user.id;
    const requesterRole = await this.teamMembersService.getMemberByTeamAndUser(
      teamId,
      requesterId,
    );

    if (
      !requesterRole ||
      (requesterRole.role !== TeamRoles.ADMIN &&
        requesterRole.role !== TeamRoles.OWNER)
    )
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    if (role === TeamRoles.OWNER && requesterRole.role !== TeamRoles.OWNER)
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    if (role === TeamRoles.ADMIN && requesterRole.role !== TeamRoles.OWNER)
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    return this.teamMembersService.removeMember(teamId, userId);
  }

  @Get(':teamId/members')
  async getMembers(@Param('teamId') teamId: string) {
    return this.teamMembersService.getMembersByTeam(teamId);
  }

  @Delete(':teamId/members/:userId')
  async removeMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    const requesterId = req.user.id;
    const requesterRole = await this.teamMembersService.getMemberByTeamAndUser(
      teamId,
      requesterId,
    );

    if (
      !requesterRole ||
      (requesterRole.role !== TeamRoles.ADMIN &&
        requesterRole.role !== TeamRoles.OWNER)
    )
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);

    return this.teamMembersService.removeMember(teamId, userId);
  }

  @Post(':teamId/invite')
  async inviteUser(
    @Param('teamId') teamId: string,
    @Body() { userId }: { userId: string },
  ) {
    return this.teamInvitationsService.inviteUser(teamId, userId);
  }

  @Post('invitations/:invitationId')
  async respondInvitation(
    @Param('invitationId') invitationId: string,
    @Body() { status }: { status: 'accepted' | 'declined' },
  ) {
    return this.teamInvitationsService.respondInvitation(invitationId, status);
  }
}
