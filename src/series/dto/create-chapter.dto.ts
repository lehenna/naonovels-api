import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  volumeId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  number: number;
}
