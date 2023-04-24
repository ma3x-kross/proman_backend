import { IsString, Length, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(6, 16)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  @MaxLength(13)
  phone: string;

  @IsString()
  telegramUsername: string;
}
