import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        const m = r.message;
        if (Array.isArray(m)) {
          message = m as string[];
        } else if (typeof m === 'string') {
          message = m;
        } else {
          message = exception.message;
        }
        if (typeof r.error === 'string') {
          error = r.error;
        } else {
          error = exception.name;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `[${request.method} ${request.url}] ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error(
        `[${request.method} ${request.url}] Non-error exception: ${String(exception)}`,
      );
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method} ${request.url}] ${status} ${JSON.stringify(message)}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
