import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  products: string;

  @Prop({ required: true, type: Number })
  unitPrice: number;

  @Prop({ type: String, required: true })
  qtyBought: string;

  @Prop({ type: String })
  goodsValue: string;

  @Prop({ type: String, ruquired: true })
  salesPrice: string;

  @Prop({ type: String })
  qtySold: string;

  @Prop({ type: String })
  salesValue: string;

  @Prop({ type: String })
  remainingItems: string;

  @Prop({ type: String })
  exp: string;

  @Prop({ type: String, required: true })
  avalibility: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  adminId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
