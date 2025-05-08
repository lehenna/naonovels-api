import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Volume extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Series' })
  seriesId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  number: number;
}

export const VolumeSchema = SchemaFactory.createForClass(Volume);
