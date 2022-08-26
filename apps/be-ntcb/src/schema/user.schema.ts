import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  collection: 'User',
  timestamps: true,
  toJSON: { virtuals: true },
})
export class User {
  @Prop()
  uid: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ '$**': 'text' });
