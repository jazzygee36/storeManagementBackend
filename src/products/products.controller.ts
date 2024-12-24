import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('/create-product')
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    const adminId = req.admin.id; // Assuming adminId is set in the request after authentication
    return this.productService.createProduct(adminId, createProductDto);
  }

  @Get('/all-products')
  async getAdminProducts(@Req() req: any) {
    const adminId = req.admin.id;
    return this.productService.getProductsByAdmin(adminId);
  }
}
