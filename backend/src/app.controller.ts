import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return {
      message: 'Slooze Hotel Management API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        restaurants: '/api/restaurants',
        menu: '/api/menu',
        orders: '/api/orders',
      }
    };
  }
}
