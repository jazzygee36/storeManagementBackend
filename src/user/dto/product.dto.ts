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
  goodsValue: string;

  @IsNotEmpty()
  @IsString()
  salesPrice: string;

  qtySold: string;

  @IsNotEmpty()
  @IsString()
  salesValue: string;

  @IsNotEmpty()
  @IsString()
  remainingItems: string;

  exp: string;

  @IsNotEmpty()
  @IsString()
  availability: string;
}
