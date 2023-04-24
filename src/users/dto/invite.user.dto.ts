import { IsEmail, IsString } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
