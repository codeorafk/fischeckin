import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DetailTripDocument = DetailTrip & Document;

@Schema({
  collection: 'DetailTrip',
  timestamps: true,
  toJSON: { virtuals: true },
})
export class DetailTrip {
  @Prop()
  lat: string;

  @Prop({ required: true })
  lng: string;

  @Prop()
  status: string;

  @Prop()
  detail: string;
}

export const DetailTripSchema = SchemaFactory.createForClass(DetailTrip);
DetailTripSchema.index({ '$**': 'text' });
