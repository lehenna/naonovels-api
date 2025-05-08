import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateVolumeDto {
  @IsString()
  @IsNotEmpty()
  seriesId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  number: number;
}
