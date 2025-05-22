import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ unique: true, required: true, trim: true, lowercase: true })
  name: string;

  @Prop()
  publicName?: string;

  @Prop()
  icon?: string;

  @Prop()
  description?: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
