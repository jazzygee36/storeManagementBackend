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

  @Prop({ required: true, type: Number })
  salesPrice: number;

  @Prop({
    type: Number,
    default: function (this: Product) {
      return this.qtyBought;
    },
  })
  qtyRemaining: number;

  @Prop({ type: String })
  availability: string;

  @Prop({ type: Date })
  exp: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add pre-save middleware to calculate `availability`
ProductSchema.pre('save', function (next) {
  if (this.qtyRemaining === 0) {
    this.availability = 'Out-of-stock';
  } else if (this.qtyRemaining < 4) {
    this.availability = 'Low';
  } else {
    this.availability = 'In-stock';
  }

  next();
});
