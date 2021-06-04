import { Injectable } from '@nestjs/common';
import { ApiProduces } from '@nestjs/swagger';

@Injectable()
export class AppService {
  @ApiProduces('text/plain')
  getHello(): string {
    return 'Hello World!';
  }
}
