import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
// import { Transform } from 'class-transformer';
export class CreateProductDto {
  @IsNotEmpty()
  // @IsString()
  productName: string;

  @IsNotEmpty()
  unitPrice: number;

  @IsNotEmpty()
  qtyBought: string;

  @IsNotEmpty()
  salesPrice: string;

  @IsOptional()
  qtyRemaining: string;

  @IsOptional()
  availability: string;

  // @Transform(({ value }) => moment(value, 'DD/MM/YYYY', true).toDate())
  @IsOptional()
  exp: string;

  // @IsNotEmpty()
  // @IsString()
  // availability: string;
}
