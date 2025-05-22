import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/lib/decorators';
import { UsersService } from '@/users/services/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let token = request.cookies?.access_token;
    if (!token) token = request.headers.authorization?.split(' ')[1];

    if (!token) return false;

    try {
      const { userId } = this.jwtService.verify(token);
      const user = await this.usersService.findById(userId);
      request.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
