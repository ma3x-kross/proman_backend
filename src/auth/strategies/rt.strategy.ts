import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../../users/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { removeExtraFromReturnedFields } from '../../utils/helpers';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { compare } from 'bcryptjs';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt-jwt') {
  constructor(
    private configService: ConfigService,
    @InjectModel(UserModel) private userModel: typeof UserModel,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies.refresh,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),

      passReqToCallback: true, // чтобы передавать req
    });
  }

  async validate(req: Request, { id }: Pick<UserModel, 'id'>): Promise<any> {
    const oldRefreshToken = req.cookies.refresh;
    const user = await this.userModel.findByPk(id, { include: { all: true } });
    if (!user) throw new UnauthorizedException('Пользователь не найден!');
    const compareTokens = await compare(oldRefreshToken, user.refreshToken);
    if (!compareTokens) throw new UnauthorizedException('Неверный токен!');
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user,
    );
    return {
      ...removeExtraFromReturnedFields(user),
      accessToken,
      refreshToken,
    };
  }
}
