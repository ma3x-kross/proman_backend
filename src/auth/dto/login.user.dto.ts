import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'test@mail.ru', description: 'Электронная почта' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Qwerty12',
    description: 'Пароль длинее 6 и короче 16 символов',
  })
  @IsString()
  @Length(6, 16)
  password: string;
}
