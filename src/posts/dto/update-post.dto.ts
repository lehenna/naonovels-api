import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  textContent?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagePaths?: string[];
}
