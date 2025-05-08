import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Chapter extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Volume' })
  volumeId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  number: number;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
