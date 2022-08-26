import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';

import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/:phone')
  checkUser(@Param('phone') phone: string) {
    return this.service.checkUser(phone);
  }
}
