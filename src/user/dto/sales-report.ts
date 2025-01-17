import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleReportDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  sellingPrice: number;

  @IsNotEmpty()
  @IsNumber()
  qtySold: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  grandTotal: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  productName?: string;
}

// Wrapper for array validation
export class SaleReportArrayDto {
  @Type(() => SaleReportDto)
  @IsNotEmpty()
  reports: SaleReportDto[];
}
