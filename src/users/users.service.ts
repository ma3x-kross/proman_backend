import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterUserDto } from '../auth/dto/register.user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleToUserDto } from './dto/add.role.to.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private userModel: typeof UserModel,
    private rolesService: RolesService,
  ) {}

  async create(dto: RegisterUserDto) {
    const existUser = await this.getByEmail(dto.email);
    if (existUser)
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    const user = await this.userModel.create(dto);
    const role = await this.rolesService.getByValue('DEVELOPER');
    await user.$set('roles', role.id);
    return await this.userModel.findByPk(user.id, { include: ['roles'] });
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({
      where: { email },
      include: ['roles'],
    });
  }

  async getAll() {
    return await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async delete(id: number) {
    const user = await this.userModel.findByPk(id);
    await user.destroy();
  }

  async addRole({ value, userId }: AddRoleToUserDto) {
    const role = await this.rolesService.getByValue(value);
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new BadRequestException('Пользователь не найден');
    await user.$add('roles', role.id);
  }
}
