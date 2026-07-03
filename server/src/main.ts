import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('student-os')
    .setVersion('1.0')
    .setDescription('STUDENT-OS API documentation')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'Access-JWT',
    //     description: 'Enter JWT access token',
    //     in: 'header',
    //   },
    //   'JWT-access-token',
    // )
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'Refresh-JWT',
    //     description: 'Enter JWT refresh token',
    //     in: 'header',
    //   },
    //   'JWT-refresh-token',
    // )
    .addServer('http://localhost:3000', 'Development server')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(APP_CONSTANT.API_DOCS, app, documentFactory, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationSorter: 'alpha',
    },
    customSiteTitle: 'STUDENT-OS - API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none; }
    `,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error('Failed to start application: ', err);
  Logger.error('Error starting server: ', err);
  process.exit(1);
});
