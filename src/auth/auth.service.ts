import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register.user.dto';
import { UsersService } from '../users/users.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginUserDto } from './dto/login.user.dto';
import { removePasswordFromReturnedFields } from '../utils/helpers';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async hashValue(value: string) {
    const salt = await genSalt(10);
    return await hash(value, salt);
  }

  async validateUser(dto: LoginUserDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException(
        'Пользователь с таким email не зарегистрирован',
      );
    const passwordEquals = await compare(dto.password, user.password);
    if (!passwordEquals) throw new UnauthorizedException('Неверный пароль');
    return removePasswordFromReturnedFields(user);
  }

  async register(dto: RegisterUserDto) {
    return await this.userService.create({
      ...dto,
      password: await this.hashValue(dto.password),
    });
  }

  async login(dto: LoginUserDto) {
    const user = this.validateUser(dto);
    return user;
  }
}
