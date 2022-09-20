import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/user')
  users() {
    return this.appService.getListUser();
  }

  @Post('/check')
  check(@Req() request: Request) {
    const body = request.body;
    if (body) {
      return this.appService.apiCheck(body['user'], body['pass']);
    }
    return {};
  }

  @Post('/edit')
  edit(@Req() request: Request) {
    const body = request.body;
    if (body) {
      return this.appService.editUser(body);
    }
    return {};
  }
}
