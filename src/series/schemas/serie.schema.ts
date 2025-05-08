import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Serie extends Document {
  @Prop()
  cover?: string;

  @Prop()
  icon?: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  alternative?: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ required: true })
  synopsis: string;

  @Prop({ required: true })
  demography: number;

  @Prop({ type: [Number], required: true })
  genres: number[];

  @Prop({ required: true })
  state: number;

  @Prop({ required: true })
  format: number;

  @Prop({ type: [String], required: true })
  authors: string[];

  @Prop({ type: [String], required: true })
  artists: string[];
}

export const SerieSchema = SchemaFactory.createForClass(Serie);
