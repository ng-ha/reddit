import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class Token {
  _id!: mongoose.Types.ObjectId;

  @prop({ required: true })
  userId!: string;

  @prop({ required: true })
  token!: string;

  @prop({ default: Date.now, expires: 5 * 60 })
  createdAt: Date;
}

export const TokenModal = getModelForClass(Token);
