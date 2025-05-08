import CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';

import { RedisService } from '@/common/services/redis.service';
import { MailerService } from '@/common/services/mailer.service';

@Injectable()
export class MagicLinkService {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async generateMagicLink(email: string, redirect: string): Promise<string> {
    const token = CryptoJS.SHA256(email + Date.now().toString()).toString();

    await this.redisService.set(token, email);

    const link = `${redirect}?token=${token}`;
    await this.sendEmail(email, link);

    return link;
  }

  async sendEmail(email: string, link: string) {
    await this.mailerService.send(
      email,
      'Verificación',
      `Para continuar verifica tu correo con este enlace: ${link}`,
    );
  }

  async verifyMagicLink(token: string): Promise<string | null> {
    const email = await this.redisService.get(token);
    if (email) {
      await this.redisService.delete(token);
      return email;
    }
    return null;
  }
}
