import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/products';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(
    adminId: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    if (!Types.ObjectId.isValid(adminId)) {
      throw new Error('Invalid admin ID');
    }

    const product = new this.productModel({
      ...createProductDto,
      adminId: new Types.ObjectId(adminId),
    });
    return product.save();
  }

  async getProductsByAdmin(adminId: string): Promise<Product[]> {
    if (!Types.ObjectId.isValid(adminId)) {
      throw new Error('Invalid admin ID');
    }

    return this.productModel
      .find({ adminId: new Types.ObjectId(adminId) })
      .exec();
  }
}
