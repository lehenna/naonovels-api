import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TeamRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  EDITOR = 'editor',
}

@Schema({ timestamps: true })
export class TeamMember extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  teamId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(TeamRoles) })
  role: TeamRoles;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
