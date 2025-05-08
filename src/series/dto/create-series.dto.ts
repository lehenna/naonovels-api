import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateSeriesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  alternative?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @IsInt()
  demography: number;

  @IsArray()
  @IsInt({ each: true })
  genres: number[];

  @IsInt()
  state: number;

  @IsInt()
  format: number;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsArray()
  @IsString({ each: true })
  artists: string[];
}
