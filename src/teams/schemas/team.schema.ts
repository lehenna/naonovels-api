import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TeamRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  icon?: string;

  @Prop({ unique: true, required: true })
  identifier: string;

  @Prop()
  description?: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
