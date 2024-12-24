import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/products';
import { Admin, AdminSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    // Register both Product and Admin schemas
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
