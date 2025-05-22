import { Module } from '@nestjs/common';
import { RedisModule } from '@/common/modules/redis.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { VerificacionCodeService } from './services/verificacion-code.service';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '@/common/modules/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '6h' },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    RedisModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerificacionCodeService],
  exports: [AuthService],
})
export class AuthModule {}
