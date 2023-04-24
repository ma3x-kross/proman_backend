import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  value: string;

  @IsString()
  description: string;
}
