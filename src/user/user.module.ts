import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email-service';
import { Product, ProductSchema } from './schemas/products';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY || '4oei89504hgmndtiimmgbnshgj', // Use environment variables for this in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
