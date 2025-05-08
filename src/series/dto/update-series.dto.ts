import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdateSeriesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  alternative?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  synopsis?: string;

  @IsOptional()
  @IsInt()
  demography?: number;

  @IsArray()
  @IsInt({ each: true })
  genres?: number[];

  @IsOptional()
  @IsInt()
  state?: number;

  @IsOptional()
  @IsInt()
  format?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  artists?: string[];
}
