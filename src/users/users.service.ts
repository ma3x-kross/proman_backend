import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterUserDto } from '../auth/dto/register.user.dto';
import { removePasswordFromReturnedFields } from '../utils/helpers';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  async create(dto: RegisterUserDto) {
    const existUser = await this.getByEmail(dto.email);
    if (existUser)
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    const user = await this.userModel.create(dto);
    return removePasswordFromReturnedFields(user);
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
  }

  async getAll() {
    const user = await this.getByEmail('@mail.ru');
    if (user) return user;
    const users = await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
    return users;
  }

  async delete(id: number) {
    const user = await this.userModel.findByPk(id);
    await user.destroy();
  }
}
