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
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    return { user: req.user };
  }

  @Patch(':teamId/icon')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('icon'))
  async updateUserIcon(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.id;

    const fileName = await this.uploadsService.saveImage(file);

    return this.usersService.update(userId, { icon: fileName });
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateMe(@Req() req, @Body() userData: UpdateUserDto) {
    const userId = req.user.id;

    if (userData.identifier) {
      userData.identifier = userData.identifier.toLowerCase().trim();
      const teamExists = await this.usersService.findByIdentifier(
        userData.identifier,
      );
      if (teamExists)
        throw new HttpException(
          'Identifier already in use.',
          HttpStatus.BAD_REQUEST,
        );
    }

    return this.usersService.update(userId, userData);
  }
}
