import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role, Country } from '../../common/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsEnum(Country)
  country: Country;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
