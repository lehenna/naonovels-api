import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const REDIS_HOST = this.configService.get<string>('REDIS_HOST')!;
    const REDIS_USER = this.configService.get<string>('REDIS_USER')!;
    const REDIS_PASS = this.configService.get<string>('REDIS_PASS')!;
    const REDIS_PORT = parseInt(this.configService.get<string>('REDIS_PORT')!);

    this.client = createClient({
      username: REDIS_USER,
      password: REDIS_PASS,
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    });
    this.client.connect().catch((error) => {
      console.error('Error al conectar con Redis:', error);
    });
  }

  async set(key: string, value: string, expiresIn = 600) {
    await this.client.set(key, value, { EX: expiresIn });
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delete(key: string) {
    await this.client.del(key);
  }
}
