import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { DetailTrip } from './detail.trip.schema';

export type TripDocument = Trip & Document;

@Schema({
  collection: 'Trip',
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Trip {
  @Prop()
  uid: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  name: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: DetailTrip.name,
    default: [],
  })
  detail: DetailTrip[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({ '$**': 'text' });
