import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { nanoid } from 'nanoid';

import { UserRoles } from '@/users/schemas/users.schema';
import { UsersService } from '@/users/services/users.service';
import { VerificacionCodeService } from '../services/verificacion-code.service';
import { AuthService } from '../services/auth.service';
import { Public } from '@/common/lib/decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly verificationService: VerificacionCodeService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('send-verification-code')
  async sendVerificationCode(@Body() { email }: { email: string }) {
    await this.verificationService.generateCode(email.toLowerCase().trim());
    return {
      message: 'ok',
    };
  }

  @Public()
  @Post('validate-verification-code')
  async validateVerificationCode(
    @Body() { code, email }: { code: string; email: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const isValid = await this.verificationService.verifyCode(email, code);
    if (!isValid)
      throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        username: nanoid(21),
        role: UserRoles.USER,
      });
    }

    const tokenJwt = await this.authService.generateJwt(user.id);

    response.cookie('access_token', tokenJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { token: tokenJwt, user };
  }
}
