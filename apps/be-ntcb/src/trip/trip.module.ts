import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DetailTrip, DetailTripSchema } from '../schema/detail.trip.schema';
import { Trip, TripSchema } from '../schema/trip.schema';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    MongooseModule.forFeature([
      { name: DetailTrip.name, schema: DetailTripSchema },
    ]),
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
