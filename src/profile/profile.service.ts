import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileModel } from './profile.model';
import { RegisterUserDto } from '../auth/dto/register.user.dto';
import { UpdateUserDto } from '../users/dto/update.user.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel) private profileModel: typeof ProfileModel,
  ) {}

  async create(
    userId: number,
    { fullName, phone, telegramUsername }: RegisterUserDto,
  ) {
    return await this.profileModel.create({
      fullName,
      phone,
      telegramUsername,
      userId,
    });
  }

  async getByUserId(userId: number) {
    const profile = await this.profileModel.findOne({ where: { userId } });
    if (!profile)
      throw new BadRequestException('Профиль пользователя не найден!');
    return profile;
  }

  async update(
    userId: number,
    { fullName, phone, telegramUsername }: UpdateUserDto,
  ) {
    const profile = await this.getByUserId(userId);
    return await profile.update({ fullName, phone, telegramUsername });
  }

  async delete(userId: number) {
    const profile = await this.getByUserId(userId);
    console.log('sfdsdfhgwdh');
    await profile.destroy();
  }
}
