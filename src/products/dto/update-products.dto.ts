import { CreateProductDto } from './product.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateProductDto) {}
