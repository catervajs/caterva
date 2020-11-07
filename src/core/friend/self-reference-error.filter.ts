import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { SelfReferenceError } from './friend.service';

export class SelfReferenceErrorFilter implements ExceptionFilter {
  catch(exception: SelfReferenceError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        message: message,
      },
    });
  }
}
