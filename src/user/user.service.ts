import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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
import { Staff, StaffSchema } from './schemas/staff';
import { StaffDto } from './dto/staff.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { SaleReportDto } from './dto/sales-report';
import { SalesReport } from './schemas/sales-report';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    @InjectModel(SalesReport.name) private SalesReportModel: Model<SalesReport>,

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
  // Products
  async addProduct(adminId: string, productData: CreateProductDto) {
    // Perform a case-insensitive search for the product name specific to the admin
    const existingProduct = await this.productModel.findOne({
      admin: adminId, // Ensure it matches the admin
      productName: { $regex: new RegExp(`^${productData.productName}$`, 'i') },
    });

    if (existingProduct) {
      throw new ConflictException('Product already exists for this admin');
    }

    const product = new this.productModel({ ...productData, admin: adminId });

    // Set availability based on qtyRemaining
    if (product.qtyRemaining === 0) {
      product.availability = 'Out-of-stock';
    } else if (product.qtyRemaining < 4) {
      product.availability = 'Low';
    } else {
      product.availability = 'In-stock';
    }

    await product.save();

    // Update the admin's product list
    await this.adminModel.findByIdAndUpdate(adminId, {
      $push: { products: product._id },
    });

    return { message: 'Product added successfully', product };
  }

  async deleteProduct(productId: string) {
    // Validate the productId format
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('Invalid product ID format');
    }
    // Check if the product exists
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productModel.findByIdAndDelete(productId);
    // Remove the product from the admin's products array
    await this.adminModel.updateOne(
      { products: productId }, // Filter condition
      { $pull: { products: productId } }, // Update operation
    );

    return { message: 'Product deleted successfully' };
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Update the product fields with the new data
    Object.assign(product, updateProductDto);

    // Update availability based on qtyRemaining
    if (product.qtyRemaining === 0) {
      product.availability = 'Out-of-stock';
    } else if (product.qtyRemaining < 4) {
      product.availability = 'Low';
    } else {
      product.availability = 'In-stock';
    }

    // Save the updated product to the database
    await product.save();
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
      .populate('products')
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

  // Staff login

  async createStaff(adminId: string, staffData: StaffDto) {
    // Verify the admin exists
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Check if staff with the same username or phone number already exists under this admin
    const existingStaff = await this.staffModel.findOne({
      $or: [
        { username: staffData.username, admin: adminId },
        { phoneNumber: staffData.phoneNumber, admin: adminId },
      ],
    });

    if (existingStaff) {
      if (existingStaff.username === staffData.username) {
        throw new ConflictException('Staff username already exists');
      } else if (existingStaff.phoneNumber === staffData.phoneNumber) {
        throw new ConflictException('Staff with phone number already exists');
      }
    }

    // Create a new staff document with the admin field set
    const newStaff = new this.staffModel({ ...staffData, admin: adminId });

    // Save the staff document to the database
    try {
      await newStaff.save();
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ConflictException('Phone number already exists');
      }
      throw error; // Rethrow other errors
    }

    // Associate the new staff with the admin's staff list
    if (!admin.staff) {
      admin.staff = []; // Initialize staff array if it doesn't exist
    }
    admin.staff.push(newStaff._id as any); // Add the staff's ObjectId to the admin's staff array

    // Save the admin document
    await admin.save();

    // Return a success message and the created staff object
    return { message: 'Staff created successfully', staff: newStaff };
  }

  async getStaff(adminId: string) {
    const admin = await this.adminModel
      .findById(adminId)
      .populate('staff')
      .exec();

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin.staff;
  }

  async getProductsForStaff(staffId: string) {
    const staff = await this.staffModel
      .findById(staffId)
      .populate<{ admin: Admin }>('admin');

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Check if admin was populated properly
    if (!staff.admin) {
      throw new NotFoundException('Admin not found for this staff');
    }

    // Access the admin's _id
    const products = await this.productModel.find({
      admin: staff.admin._id,
    });

    return products;
  }

  async staffLogin(staffDto: StaffDto): Promise<any> {
    const staff = await this.staffModel.findOne({
      phoneNumber: staffDto.phoneNumber,
    });
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Fetch the admin associated with this staff
    const admin = await this.adminModel.findById(staff.admin);
    if (!admin) {
      throw new NotFoundException('Admin not found for this staff');
    }

    // Get the products created by the admin
    // const products = await this.productModel.find({ admin: admin._id });

    // Create the token payload
    const payload = { phoneNumber: staff.phoneNumber, role: 'staff' };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      staffId: staff._id,
      // products,
    };
  }

  async getStaffProfile(staffId: string): Promise<Staff> {
    const staff = await this.staffModel.findById(staffId);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async dailySalesReport(
    staffId: string,
    salesReportDtos: SaleReportDto[],
  ): Promise<any> {
    const results = [];

    for (const saleReportDto of salesReportDtos) {
      const product = await this.productModel.findById(saleReportDto.productId);
      if (!product) {
        throw new NotFoundException(
          `Product not found for ID: ${saleReportDto.productId}`,
        );
      }

      if (saleReportDto.qtySold > product.qtyRemaining) {
        throw new NotFoundException(
          `Not enough stock for product: ${product.productName}`,
        );
      }

      // Update product stock
      product.qtyRemaining -= saleReportDto.qtySold;
      await product.save();

      // Create sales report
      const sale = await this.SalesReportModel.create({
        ...saleReportDto,
        staff: staffId,
        productName: product.productName,
        date: new Date(), // Ensure sales have a date
      });

      results.push({
        saleId: sale._id,
        productName: product.productName,
        qtySold: saleReportDto.qtySold,
        totalPrice: saleReportDto.totalPrice,
        sellingPrice: saleReportDto.sellingPrice,
        paymentMethod: saleReportDto.paymentMethod,
      });
    }

    return {
      message: 'Sales recorded successfully',
      results,
    };
  }

  async getDailySalesReport(staffId: string): Promise<any> {
    const sales = await this.SalesReportModel.find({ staff: staffId })
      .populate('staff', 'username phoneNumber')
      .exec();

    const groupedSales = sales.reduce((acc, sale) => {
      const saleDate = sale.date.toISOString().split('T')[0]; // Group by date (YYYY-MM-DD)

      if (!acc[saleDate]) {
        acc[saleDate] = {
          sales: [],
          grandTotal: 0,
        };
      }

      acc[saleDate].sales.push(sale);
      acc[saleDate].grandTotal += sale.totalPrice; // Sum total prices for GrandTotal

      return acc;
    }, {});

    return {
      message: 'Sales retrieved successfully',
      salesByDate: groupedSales,
    };
  }

  async deleteStaff(staffId: string) {
    const staff = await this.staffModel.findById(staffId).exec();
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Find the admin associated with the staff
    // const admin = await this.adminModel.findById(staff.admin);
    // if (!admin) {
    //   throw new NotFoundException('Admin not found for this staff');
    // }
    await staff.deleteOne(); // Deletes the found staff
    return { message: 'Staff deleted successfully' };
  }
}
