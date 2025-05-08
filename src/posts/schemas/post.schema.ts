import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Team' })
  teamId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Chapter' })
  chapterId: Types.ObjectId;

  @Prop()
  textContent?: string;

  @Prop({ type: [String] })
  imagePaths?: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
