import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/product.dto';

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

  @Post(':id/add-products')
  async addProduct(
    @Param('id') adminId: string,
    @Body(ValidationPipe) productData: CreateProductDto,
  ) {
    return this.userService.addProduct(adminId, productData);
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
}
