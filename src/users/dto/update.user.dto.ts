import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(6, 16)
  password?: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(13)
  phone: string;

  @IsOptional()
  @IsString()
  telegramUsername: string;
}
