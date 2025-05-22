import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(userId: string) {
    return this.jwtService.sign(
      { userId },
      {
        expiresIn: '14d',
      },
    );
  }

  async verifyJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
