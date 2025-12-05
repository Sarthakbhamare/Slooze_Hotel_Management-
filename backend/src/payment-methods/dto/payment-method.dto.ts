import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { PaymentMethodType } from '../../common/enums';

export class CreatePaymentMethodDto {
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @IsString()
  cardNumber: string;

  @IsString()
  cardHolderName: string;

  @IsString()
  expiryDate: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsString()
  cardNumber?: string;

  @IsOptional()
  @IsString()
  cardHolderName?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
