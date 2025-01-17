import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  // UseGuards,
  ValidationPipe,
  UseGuards,
  Put,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/product.dto';
import { StaffDto } from './dto/staff.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { Product } from './schemas/products';
import { SaleReportDto } from './dto/sales-report';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string): Promise<string> {
    return this.userService.verifyEmail(token);
  }

  @Post('/login')
  loginUser(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('/profile')
  async getProfile(@Query('userId') userId: string) {
    return await this.userService.getProfile(userId);
  }

  @Get('/users')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateData: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  // Products
  @Post(':id/add-products')
  async addProduct(
    @Param('id') adminId: string,
    @Body(ValidationPipe) productData: CreateProductDto,
  ) {
    return this.userService.addProduct(adminId, productData);
  }

  @Put(':id/update/product')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.userService.updateProduct(id, updateProductDto);
  }

  @Delete(':id/delete/product')
  async deleteProduct(
    @Param('id') productId: string, // Validate that `id` is a valid UUID
  ) {
    return this.userService.deleteProduct(productId);
  }

  // Staffffffffff
  // Endpoint to create a staff member
  @Post(':adminId/create-staff')
  async createStaff(
    @Param('adminId') adminId: string,
    @Body() staffData: StaffDto,
  ) {
    return this.userService.createStaff(adminId, staffData);
  }

  // Endpoint to get all staff for an admin
  @Get(':adminId/all-staffs')
  async getStaff(@Param('adminId') adminId: string) {
    return this.userService.getStaff(adminId);
  }

  // Endpoint for staff login
  @Post('/staff/login')
  async staffLogin(@Body(ValidationPipe) staffLoginDto: StaffDto) {
    return this.userService.staffLogin(staffLoginDto);
  }

  // Endpoint to get all products available for a staff member
  @Get(':staffId/products')
  async getProductsForStaff(@Param('staffId') staffId: string) {
    return this.userService.getProductsForStaff(staffId);
  }

  // Endpoint to get staff profile
  @Get(':staffId/profile')
  async getStaffProfile(@Param('staffId') staffId: string) {
    return this.userService.getStaffProfile(staffId);
  }

  @Delete(':id/delete/staff')
  async deleteStaff(
    @Param('id') productId: string, // Validate that `id` is a valid UUID
  ) {
    return this.userService.deleteStaff(productId);
  }

  //END POINTS FOR DAILY SALES REPORT
  @Post(':staffId/daily-sales')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async dailySalesReport(
    @Param('staffId') staffId: string,
    @Body() salesReportDtos: SaleReportDto[],
  ) {
    return this.userService.dailySalesReport(staffId, salesReportDtos);
  }

  @Get('daily-sales-report/:staffId')
  async getDailySalesReport(
    @Param('staffId') staffId: string,
    @Query('date') date?: string,
  ) {
    return this.userService.getDailySalesReport(staffId);
  }
}
