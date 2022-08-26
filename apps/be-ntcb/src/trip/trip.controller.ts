import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { TripService } from './trip.service';
import { Request } from 'express';

@Controller('trip')
export class TripController {
  constructor(private readonly service: TripService) {}

  @Get('check/:phone')
  checkTrip(@Param('phone') phone: string) {
    return this.service.checkTrip(phone);
  }

  @Post('/start')
  startTrip(@Req() request: Request) {
    return this.service.startTrip(request);
  }

  @Post('/end')
  endTrip(@Req() request: Request) {
    return this.service.endTrip(request);
  }

  @Get('/:phone')
  getAllTrip(@Param('phone') phone: string) {
    return this.service.getAllTrip(phone);
  }
}
