import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@/common/services/mailer.service';
import { TeamInvitation } from '../schemas/team-invitation.schema';

@Injectable()
export class TeamInvitationsService {
  constructor(
    @InjectModel(TeamInvitation.name)
    private invitationModel: Model<TeamInvitation>,
    private readonly mailerService: MailerService,
  ) {}

  async inviteUser(teamId: string, userId: string) {
    const invitation = await this.invitationModel.create({ teamId, userId });

    await this.mailerService.send(
      userId,
      'Invitación a un equipo',
      `<p>Únete al equipo aquí: https://yourapp.com/team/${teamId}</p>`,
    );

    return invitation;
  }

  async respondInvitation(
    invitationId: string,
    status: 'accepted' | 'declined',
  ) {
    return this.invitationModel
      .findByIdAndUpdate(invitationId, { status }, { new: true })
      .exec();
  }
}
