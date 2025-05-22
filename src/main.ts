import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: (origin, callback) => {
        callback(null, origin);
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Nao Novels API')
    .setDescription('The Nao Novels API')
    .setVersion('1.0')
    .addTag('naovels')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap().catch((error) => {
  console.error(error);
});
