import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRoles } from '../schemas/users.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  role: UserRoles;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  publicName?: string;
}
