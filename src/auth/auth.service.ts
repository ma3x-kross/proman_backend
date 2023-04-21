import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.user.dto';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { LoginUserDto } from './dto/login.user.dto';
import { hashValue, removeExtraFromReturnedFields } from '../utils/helpers';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../users/user.model';
import { UserWithTokens } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(dto: LoginUserDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException(
        'Пользователь с таким email не зарегистрирован',
      );
    const passwordEquals = await compare(dto.password, user.password);
    if (!passwordEquals) throw new UnauthorizedException('Неверный пароль');
    return user;
  }

  async generateTokens(user: UserModel) {
    const data = removeExtraFromReturnedFields(user);
    const payload = { id: data.id, email: data.email, roles: data.roles };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    await user.update({ refreshToken: await hashValue(refreshToken) });
    await user.save();
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterUserDto, link: string): Promise<UserWithTokens> {
    const user = await this.userService.activate(
      {
        ...dto,
        password: await hashValue(dto.password),
      },
      link,
    );
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return {
      ...removeExtraFromReturnedFields(user),
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginUserDto): Promise<UserWithTokens> {
    const user = await this.validateUser(dto);
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return {
      ...removeExtraFromReturnedFields(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(email: string, refreshToken: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new UnauthorizedException('Пользователь не найден');
    const compareTokens = await compare(refreshToken, user.refreshToken);
    if (!compareTokens) throw new UnauthorizedException('Неверный токен');
    await user.update({ refreshToken: null });
    await user.save();
  }
}
