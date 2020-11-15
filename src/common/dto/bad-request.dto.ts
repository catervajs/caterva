import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;
}

export class BadRequestDto {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  path: string;

  @ApiProperty()
  error: ErrorDto;
}
