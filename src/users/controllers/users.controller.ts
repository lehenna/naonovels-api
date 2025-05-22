import {
  Controller,
  Get,
  Body,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '@/common/services/uploads.service';
import { Public } from '@/common/lib/decorators';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Public()
  @Get()
  async getAllUsers(
    @Query('name') name?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll({ name }, page, limit);
  }

  @Get('me')
  async getMe(@Req() req) {
    return { user: req.user };
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateMe(
    @Req() req,
    @Body() userData: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;

    if (userData.username) {
      userData.username = userData.username.toLowerCase().trim();
      const userExists = await this.usersService.findByUsername(
        userData.username,
      );
      if (userExists)
        throw new HttpException(
          'Username already in use.',
          HttpStatus.BAD_REQUEST,
        );
    }

    delete userData.avatar;
    if (file) {
      const fileName = await this.uploadsService.saveImage(file);
      userData.avatar = fileName;
      if (req.user.avatar)
        await this.uploadsService.removeImage(req.user.avatar);
    }

    const user = await this.usersService.update(userId, userData);

    return { user };
  }
}
