import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  MODER = 'moder',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  avatar?: string;

  @Prop({ unique: true, required: true, lowercase: true, trim: true })
  username: string;

  @Prop()
  publicName?: string;

  @Prop({ required: true, enum: Object.values(UserRoles) })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
