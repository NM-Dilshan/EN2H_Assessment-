import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {

  @Get()
  @Public()
  getHome() {
    return {
      message: "Booking Platform REST API",
      status: "Running Successfully",
      version: "1.0.0",
      documentation: "/api",
      endpoints: {
        auth: "/auth",
        services: "/services",
        bookings: "/bookings"
      }
    };
  }

}