import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module.js';
import { APP_CONSTANT } from './common/constants/app.constant.js';
import { getAllowedOrigins } from './common/utils/cors.util.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter.js';
import {
  SessionResponseDto,
  SignInResponseDto,
  SignOutResponseDto,
} from './modules/auth/dto/auth-response.dto.js';
import { SignInDto } from './modules/auth/dto/sign-in.dto.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // API prefix
  app.setGlobalPrefix(APP_CONSTANT.API_VERSION);

  // CORS
  app.enableCors({
    origin: getAllowedOrigins(),
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

  // Global exception filters. Register the catch-all first and the more specific Prisma filter last so Nest resolves the latter first for
  // Prisma errors and falls through to the catch-all for everything else.
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaClientExceptionFilter(),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('student-os')
    .setVersion('1.0')
    .setDescription('STUDENT-OS API DOCUMENTATION')
    .addServer('http://localhost:3001', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      SignInDto,
      SessionResponseDto,
      SignInResponseDto,
      SignOutResponseDto,
    ],
  });

  // Manually add better-auth endpoints to Swagger
  document.paths[`/${APP_CONSTANT.API_VERSION}/auth/sign-in/email`] = {
    post: {
      tags: ['Auth'],
      summary: 'Sign in with email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/SignInDto`,
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful sign-in',
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/SignInResponseDto`,
              },
            },
          },
        },
      },
    },
  };
  document.paths[`/${APP_CONSTANT.API_VERSION}/auth/sign-out`] = {
    post: {
      tags: ['Auth'],
      summary: 'Sign out',
      responses: {
        '200': {
          description: 'Successful sign-out',
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/SignOutResponseDto`,
              },
            },
          },
        },
      },
    },
  };
  document.paths[`/${APP_CONSTANT.API_VERSION}/auth/get-session`] = {
    get: {
      tags: ['Auth'],
      summary: 'Get current session',
      responses: {
        '200': {
          description: 'Current session',
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/SessionResponseDto`,
              },
            },
          },
        },
      },
    },
  };
  // document.paths[`/${APP_CONSTANT.API_VERSION}/auth/list-sessions`] = {
  //   get: {
  //     tags: ['Auth'],
  //     summary: 'Session list',
  //     responses: {
  //       '200': {
  //         description: 'Session list',
  //         content: {
  //           'application/json': {
  //             schema: {
  //               $ref: `#/components/schemas/SessionListResponseDto`,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // };

  SwaggerModule.setup(APP_CONSTANT.API_DOCS, app, document, {
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
