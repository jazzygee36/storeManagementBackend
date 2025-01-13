import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true })
  admin: mongoose.Schema.Types.ObjectId; // Explicit reference to Admin
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
