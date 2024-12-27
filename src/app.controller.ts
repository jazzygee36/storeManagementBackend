import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Root controller
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): string {
    return 'Welcome to the Store Management Backend!';
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
