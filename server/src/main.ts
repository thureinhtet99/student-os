import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { APP_CONSTANT } from './common/constants/app.constant.js';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // API prefix
  app.setGlobalPrefix(APP_CONSTANT.API_VERSION);

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeader: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filters
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error('Failed to start application: ', err);
  Logger.error('Error starting server: ', err);
  process.exit(1);
});
