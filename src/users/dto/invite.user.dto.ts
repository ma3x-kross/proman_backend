import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsNumber()
  @IsOptional()
  rate: number;
}
