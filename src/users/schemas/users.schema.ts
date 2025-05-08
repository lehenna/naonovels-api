import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  icon?: string;

  @Prop({ unique: true, required: true })
  identifier: string;

  @Prop()
  description?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
