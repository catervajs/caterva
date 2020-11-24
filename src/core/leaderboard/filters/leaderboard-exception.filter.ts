import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { _BaseLeaderboardException } from '../leaderboard.service';

@Catch(_BaseLeaderboardException)
export class LeaderboardExceptionFilter implements ExceptionFilter {
  catch(exception: _BaseLeaderboardException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;
    const name = exception.name;
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        name: name,
        message: message,
      },
    });
  }
}
