import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  name: string;
  message: string;
}

export class BadRequestDto {
  statusCode: HttpStatus;
  timestamp: Date;
  path: string;
  error: ErrorDto;
}
