import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamMember, TeamMemberSchema } from './schemas/team-member.schema';
import {
  TeamInvitation,
  TeamInvitationSchema,
} from './schemas/team-invitation.schema';
import { MailerModule } from '@/common/modules/mailer.module';
import { TeamsService } from './services/teams.service';
import { TeamMembersService } from './services/team-members.service';
import { TeamInvitationsService } from './services/team-invitations.service';
import { TeamsController } from './controllers/teams.controller';
import { UploadsModule } from '@/common/modules/uploads.module';
import { JwtWrapperModule } from '@/common/modules/jwt-wrapper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: TeamMember.name, schema: TeamMemberSchema },
      { name: TeamInvitation.name, schema: TeamInvitationSchema },
    ]),
    MailerModule,
    UploadsModule,
    JwtWrapperModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamMembersService, TeamInvitationsService],
  exports: [TeamsService, TeamMembersService, TeamInvitationsService],
})
export class TeamsModule {}
