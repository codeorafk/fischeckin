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
  device: string;

  @Prop()
  userName: string;

  @Prop()
  passWord: string;

  @Prop()
  isCheckin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ '$**': 'text' });
