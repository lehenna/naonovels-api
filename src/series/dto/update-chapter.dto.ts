import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChapterDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsInt()
  number?: number;
}
