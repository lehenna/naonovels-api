import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TeamsService } from '../services/teams.service';
import { TeamMembersService } from '../services/team-members.service';
import { TeamInvitationsService } from '../services/team-invitations.service';
import { TeamRoles } from '../schemas/team-member.schema';
import { UploadsService } from '@/common/services/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamMembersService: TeamMembersService,
    private readonly teamInvitationsService: TeamInvitationsService,
    private readonly uploadsService: UploadsService,
  ) {}

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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async createTeam(
    @Body() { name, identifier }: { name: string; identifier: string },
    @Req() req,
  ) {
    const userId = req.user.id;
    identifier = identifier.toLowerCase().trim();

    const teamExists = await this.teamsService.getTeam({ identifier });
    if (teamExists)
      throw new HttpException(
        'Identifier already in use.',
        HttpStatus.BAD_REQUEST,
      );

    const team = await this.teamsService.createTeam(name, identifier);

    await this.teamMembersService.addMember(team.id, userId, TeamRoles.OWNER);

    return team;
  }

  @Get(':teamId')
  async getTeam(@Param('teamId') teamId: string) {
    return this.teamsService.getTeamById(teamId);
  }

  @Delete(':teamId')
  @UseGuards(JwtAuthGuard)
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

  @Patch(':teamId/icon')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('icon'))
  async updateTeamIcon(
    @Param('icon') teamId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
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

    const fileName = await this.uploadsService.saveImage(file);

    return this.teamsService.updateTeam(teamId, { icon: fileName });
  }

  @Patch(':teamId')
  @UseGuards(JwtAuthGuard)
  async updateTeam(
    @Param('teamId') teamId: string,
    @Body()
    {
      name,
      description,
      identifier,
    }: { name?: string; description?: string; identifier?: string },
    @Req() req,
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

    if (identifier) {
      identifier = identifier.toLowerCase().trim();
      const teamExists = await this.teamsService.getTeam({ identifier });
      if (teamExists)
        throw new HttpException(
          'Identifier already in use.',
          HttpStatus.BAD_REQUEST,
        );
    }

    return this.teamsService.updateTeam(teamId, { name, description });
  }

  @Post(':teamId/members')
  @UseGuards(JwtAuthGuard)
  async addMember(
    @Param('teamId') teamId: string,
    @Body() { userId, role }: { userId: string; role: TeamRoles },
  ) {
    return this.teamMembersService.addMember(teamId, userId, role);
  }

  @Get(':teamId/members')
  async getMembers(@Param('teamId') teamId: string) {
    return this.teamMembersService.getMembersByTeam(teamId);
  }

  @Delete(':teamId/members/:userId')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
