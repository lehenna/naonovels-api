import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '@/users/services/users.service';
import { MagicLinkService } from '../services/magic-link.service';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly magicLinkService: MagicLinkService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async sendMagicLink(
    @Body() { email, redirect }: { email: string; redirect: string },
  ) {
    await this.magicLinkService.generateMagicLink(
      email.toLowerCase().trim(),
      redirect,
    );
    return {
      message: 'ok',
    };
  }

  @Get('magic-link')
  async validateMagicLink(@Query('token') token: string) {
    const email = await this.magicLinkService.verifyMagicLink(token);
    if (!email)
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({ email });
    }

    const tokenJwt = await this.authService.generateJwt(user.id);

    return { token: tokenJwt, user };
  }
}
