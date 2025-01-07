import { IsString, IsNotEmpty } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsString()
  unitPrice: number;

  @IsNotEmpty()
  @IsString()
  qtyBought: string;

  @IsNotEmpty()
  @IsString()
  salesPrice: string;

  qtySold: string;

  exp: string;

  @IsNotEmpty()
  @IsString()
  availability: string;
}
