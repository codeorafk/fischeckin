import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { UserModule } from '../user/user.module';
import { TripModule } from '../trip/trip.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/NTCB'),
    TerminusModule,
    UserModule,
    TripModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
