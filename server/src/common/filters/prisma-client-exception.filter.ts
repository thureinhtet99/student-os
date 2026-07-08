import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../../prisma/generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorType = 'Internal Server Error';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = 'The provided value for one of the fields is too long.';
          errorType = 'Bad Request';
          break;
        case 'P2002': {
          status = HttpStatus.CONFLICT;
          const targets = (exception.meta?.target as string[]) || [];
          const fieldMsg =
            targets.length > 0 ? ` on field: ${targets.join(', ')}` : '';
          message = `Unique constraint failed${fieldMsg}. A record with this value already exists.`;
          errorType = 'Conflict';
          break;
        }
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message =
            'Foreign key constraint failed. One or more referenced records do not exist.';
          errorType = 'Bad Request';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = (exception.meta?.cause as string) || 'Record not found.';
          errorType = 'Not Found';
          break;
        default:
          this.logger.error(
            `Prisma error ${exception.code}: ${exception.message}`,
            exception.stack,
          );
          message = 'An unexpected database error occurred.';
          break;
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message =
        'Database validation error. The request data does not match the schema.';
      errorType = 'Unprocessable Entity';
      this.logger.error(
        `Prisma validation error: ${exception.message}`,
        exception.stack,
      );
    }

    // Log the error
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled Prisma error: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.warn(`Prisma error mapped to HTTP ${status}: ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: errorType,
      path: request.url,
    });
  }
}
