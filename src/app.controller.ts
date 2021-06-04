import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProduces } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiProduces('text/plain')
  getHello(): string {
    return this.appService.getHello();
  }
}
