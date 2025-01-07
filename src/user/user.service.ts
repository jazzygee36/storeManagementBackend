import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email-service';
import { v4 as uuidv4 } from 'uuid'; // To generate a unique verification token
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/product.dto';
import { Product } from './schemas/products';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Product.name) private productModel: Model<Product>,

    private emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Admin> {
    const existingUser = await this.adminModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exist');
    }

    // Generate a unique verification token
    const verificationToken = uuidv4();

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.adminModel({
      ...createUserDto,
      password: hashedPassword,
      isActive: false,
      verificationToken: verificationToken,
    });
    await createdUser.save();

    // Send the verification email
    const verificationLink = `https://storesinventory.netlify.app/verify-email?token=${verificationToken}`;
    await this.emailService.sendVerificationEmail(
      createUserDto.email,
      verificationLink,
    );

    return createdUser;
  }

  async verifyEmail(token: string): Promise<string> {
    const user = await this.adminModel.findOne({ verificationToken: token });

    if (!user) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    user.isActive = true;
    await user.save();

    return 'Email successfully verified!';
  }

  async addProduct(adminId: string, productData: CreateProductDto) {
    const product = new this.productModel({ ...productData, admin: adminId });
    await product.save();

    await this.adminModel.findByIdAndUpdate(adminId, {
      $push: { products: product._id },
    });
    return product;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.adminModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const comparePwd = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!comparePwd) {
      throw new NotFoundException('Password not match');
    }
    const payload = { email: user.email, password: user.password };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successfully', token, userId: user._id };
  }

  async getProfile(userId: string): Promise<Admin> {
    const user = await this.adminModel
      .findById(userId)
      .populate('products') // Populates the products associated with the user
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().populate('products').exec();
  }

  async findOne(id: string): Promise<Admin> {
    const user = await this.adminModel.findById(id).populate('products').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // async findOne(id: string): Promise<Admin> {
  //   const findUser = await this.adminModel.findById(id).exec();
  //   if (!findUser) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return findUser;
  // }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<Admin> {
    const findUser = await this.adminModel.findById(id).exec();
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    // Update the fields
    Object.assign(findUser, updateData);

    // Save the updated user
    return await findUser.save();
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const findUser = await this.adminModel.findById(id).exec();
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    await findUser.deleteOne(); // Deletes the found user
    return { message: 'User successfully deleted' };
  }
}
