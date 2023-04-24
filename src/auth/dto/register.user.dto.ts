import { IsString, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'Qwerty12',
    description: 'Пароль длинее 6 и короче 16 символов',
  })
  @IsString()
  @Length(6, 16)
  password: string;

  @ApiProperty({ example: 'Иванов Петр Михайлович', description: 'ФИО' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+79081123541', description: 'Телефонный номер' })
  @IsString()
  @MaxLength(13)
  phone: string;

  @ApiProperty({ example: 'login', description: 'Логин в телеграм' })
  @IsString()
  telegramUsername: string;
}
