import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  productName: string; // Renamed 'products' to 'productName' for clarity

  @Prop({ required: true, type: Number })
  unitPrice: number;

  @Prop({ required: true, type: Number })
  qtyBought: number;

  // @Prop({ type: Number })
  // goodsValue: number;

  @Prop({ required: true, type: Number })
  salesPrice: number;

  @Prop({ type: Number })
  qtySold: number;

  // @Prop({ type: Number })
  // salesValue: number;

  // @Prop({ type: Number })
  // remainingItems: number;

  @Prop({ type: Date })
  exp: Date;

  @Prop({ required: true, type: String })
  availability: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
