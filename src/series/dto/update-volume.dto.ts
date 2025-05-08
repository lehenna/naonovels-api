import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVolumeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsInt()
  number?: number;
}
