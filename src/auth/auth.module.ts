import { Module } from '@nestjs/common';
import { JwtWrapperModule } from '@/common/modules/jwt-wrapper.module';
import { RedisModule } from '@/common/modules/redis.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MagicLinkService } from './services/magic-link.service';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '@/common/modules/mailer.module';

@Module({
  imports: [JwtWrapperModule, UsersModule, RedisModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService, MagicLinkService],
  exports: [AuthService],
})
export class AuthModule {}
