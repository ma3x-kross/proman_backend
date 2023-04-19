import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesModel } from './models/roles.model';
import { CreateRoleDto } from './dto/create.role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(RolesModel) private rolesModel: typeof RolesModel) {}

  async create(dto: CreateRoleDto) {
    return await this.rolesModel.create(dto);
  }

  async getByValue(value: string) {
    const role = await this.rolesModel.findOne({ where: { value } });
    if (!role) throw new BadRequestException('Такой роли не существует!');
    return role;
  }

  async delete(value: string) {
    const role = await this.rolesModel.findOne({ where: { value } });
    if (!role) throw new BadRequestException('Такой роли не существует!');
    await role.destroy();
  }
}
