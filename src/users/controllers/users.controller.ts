import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UpdateUserDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '@/common/services/uploads.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Get()
  async getAllUsers(
    @Query('name') name?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll({ name }, page, limit);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    return { user: req.user };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('icon'))
  async updateMe(
    @Req() req,
    @Body() userData: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;

    if (userData.identifier) {
      userData.identifier = userData.identifier.toLowerCase().trim();
      const userExists = await this.usersService.findByIdentifier(
        userData.identifier,
      );
      if (userExists)
        throw new HttpException(
          'Identifier already in use.',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (file) {
      const fileName = await this.uploadsService.saveImage(file);
      userData.icon = fileName;
    }

    return this.usersService.update(userId, userData);
  }
}
