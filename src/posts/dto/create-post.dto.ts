import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @IsString()
  @IsOptional()
  textContent?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagePaths?: string[];
}
