import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../../users/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { removeExtraFromReturnedFields } from '../../utils/helpers';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at-jwt') {
  constructor(
    private configService: ConfigService,
    @InjectModel(UserModel) private userModel: typeof UserModel,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate({ id }: Pick<UserModel, 'id'>) {
    const user = await this.userModel.findByPk(id, { include: ['roles'] });
    if (!user) throw new BadRequestException('Недействительный токен!');
    return removeExtraFromReturnedFields(user);
  }
}
