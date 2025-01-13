import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email-service';
import { Product, ProductSchema } from './schemas/products';
import { Staff, StaffSchema } from './schemas/staff';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY || '4oei89504hgmndtiimmgbnshgj',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
