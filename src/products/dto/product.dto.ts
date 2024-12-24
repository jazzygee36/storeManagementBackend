import { IsString, IsNotEmpty } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  products: string;

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

  @IsNotEmpty()
  @IsString()
  qtySold: string;

  @IsNotEmpty()
  @IsString()
  salesValue: string;

  @IsNotEmpty()
  @IsString()
  remainingItems: string;

  @IsNotEmpty()
  @IsString()
  exp: string;

  @IsNotEmpty()
  @IsString()
  avalibility: string;
}
