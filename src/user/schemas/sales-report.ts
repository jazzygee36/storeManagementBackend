import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt` fields
export class SalesReport extends Document {
  @Prop({
    type: Date,
    required: true,
    default: Date.now, // Default to the current date and time if not provided
  })
  date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true, // Link to the Product model
  })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  sellingPrice: number;

  @Prop({ required: true })
  qtySold: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: false, default: 0 }) // Default value for grandTotal
  grandTotal: number;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: false }) // Optional field
  productName?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false }) // Optional admin reference
  admin?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: false }) // Optional staff reference
  staff?: mongoose.Schema.Types.ObjectId;
}

export const SalesReportSchema = SchemaFactory.createForClass(SalesReport);
