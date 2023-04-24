import { IsNumber, IsString } from 'class-validator';

export class AddRoleToUserDto {
  @IsString()
  value: string;

  @IsNumber()
  userId: number;
}
