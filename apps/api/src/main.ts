/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger,ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { PrismaService } from '@pet-project/prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const dbService: PrismaService = app.get(PrismaService);
  dbService.enableShutdownHooks(app);
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe(/*{ whitelist: true, transform: true }*/));
  
  const port = config.get("port") || 3333;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`Running in ${config.get("environment")} mode`);
}

bootstrap();
