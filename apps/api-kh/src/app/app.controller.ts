import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { AppService } from './app.service';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    const fileDown = await this.appService.processFile(file);

    res.attachment('Response' + new Date().toISOString() + '.csv');
    return res.status(200).send(fileDown);
  }

  @Get()
  getData() {}
}
