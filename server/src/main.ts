import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module.js';
import { APP_CONSTANT } from './common/constants/app.constant.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // API prefix
  app.setGlobalPrefix(APP_CONSTANT.API_VERSION);

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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

  // Global exception filters. Register the catch-all first and the more
  // specific Prisma filter last so Nest resolves the latter first for
  // Prisma errors and falls through to the catch-all for everything else.
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaClientExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error('Failed to start application: ', err);
  Logger.error('Error starting server: ', err);
  process.exit(1);
});
