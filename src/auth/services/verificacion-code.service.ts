import { Injectable } from '@nestjs/common';

import { RedisService } from '@/common/services/redis.service';
import { MailerService } from '@/common/services/mailer.service';

@Injectable()
export class VerificacionCodeService {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async generateCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`verification-${email}`, code, 600);
    await this.sendEmail(email, code);
  }

  async sendEmail(email: string, code: string) {
    await this.mailerService.send(
      email,
      'Verificación',
      `Para continuar verifica tu correo con este codigo: ${code}`,
    );
  }

  async verifyCode(email: string, inputCode: string) {
    const code = await this.redisService.get(`verification-${email}`);
    if (!code) return false;
    if (code !== inputCode) return false;
    await this.redisService.delete(`verification-${email}`);
    return true;
  }
}
