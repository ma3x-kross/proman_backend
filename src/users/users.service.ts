import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterUserDto } from '../auth/dto/register.user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleToUserDto } from './dto/add.role.to.user.dto';
import { MailService } from '../mail/mail.service';
import { InviteUserDto } from './dto/invite.user.dto';
import { v4 as uuidv4 } from 'uuid';
import { hashValue, removeExtraFromReturnedFields } from '../utils/helpers';
import { Op } from 'sequelize';
import { ProfileService } from '../profile/profile.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { PayrollService } from '../payroll/payroll.service';
import { RolesModel } from '../roles/models/roles.model';
import { ProfileModel } from '../profile/profile.model';
import { userQueryOptions } from '../utils/query.options';
import { ProjectsModel } from '../projects/models/projects.model';
import { RateModel } from '../payroll/models/rate.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private userModel: typeof UserModel,
    private rolesService: RolesService,
    private mailService: MailService,
    private profileService: ProfileService,
    private payrollService: PayrollService,
    @InjectModel(RateModel) private rateModel: typeof RateModel,
  ) {}

  // async create(dto: RegisterUserDto) {
  //   const existUser = await this.getByEmail(dto.email);
  //   if (existUser)
  //     throw new BadRequestException(
  //       'Пользователь с таким email уже существует',
  //     );
  //   const user = await this.userModel.create(dto);
  //   const role = await this.rolesService.getByValue('DEVELOPER');
  //   await user.$set('roles', role.id);
  //   await this.mailService.sendConfirmMail(user);
  //   return await this.userModel.findByPk(user.id, { include: ['roles'] });
  // }

  async invite({ email, role }: InviteUserDto) {
    const existUser = await this.getByEmail(email);
    if (existUser)
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    const activationLink = uuidv4();
    const activationExpire = Date.now() + 86400000;
    const user = await this.userModel.create({
      email,
      activationLink,
      activationExpire,
    });
    const entityRole = await this.rolesService.getByValue(role);
    await user.$set('roles', entityRole.id);

    if (role === 'DEVELOPER') {
      await this.payrollService.addRate({
        developerId: user.id,
        value: 100,
        date: new Date(),
      });
    }

    await this.mailService.sendConfirmMail(user);
    return await this.userModel.findByPk(user.id, { ...userQueryOptions });
  }

  async activate(dto: RegisterUserDto, activationLink: string) {
    const user = await this.userModel.findOne({
      where: { activationLink, activationExpire: { [Op.gt]: Date.now() } },
    });
    if (!user)
      throw new BadRequestException(
        'Некоректная ссылка активации (срок действия ссылки мог закончиться)',
      );
    user.password = dto.password;
    user.activationLink = null;
    user.activationExpire = null;
    await user.save();
    await this.profileService.create(user.id, dto);
    return await this.userModel.findByPk(user.id, { include: { all: true } });
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getAll(role?: string) {
    const where = role ? { value: role } : null;
    const users = await this.userModel.findAll({
      attributes: ['id'],
      include: [
        {
          model: RolesModel,
          as: 'roles',
          attributes: ['value'],
          through: { attributes: [] },
          where: where,
        },
      ],
    });
    const promises = users.map((user) => this.getOne(user.id));
    return Promise.all(promises);
  }

  async getOne(id: number) {
    const today = new Date(); // Получение текущей даты
    const formattedDate = today.toISOString().slice(0, 10);
    const user = await this.userModel.findByPk(id, {
      ...userQueryOptions,
      include: [
        ...userQueryOptions.include,
        {
          model: ProjectsModel,
          as: 'developersProjects',
          attributes: ['id', 'name', 'status', 'deadline'],
          through: { attributes: [] },
        },
        {
          model: ProjectsModel,
          as: 'projects',
          attributes: ['id', 'name', 'status', 'deadline'],
        },
        {
          model: RateModel,
          as: 'developerRates',
          attributes: ['value', 'date'],
          where: { date: { [Op.lte]: formattedDate } },
          separate: true,
          order: [['date', 'DESC']],
        },
      ],
    });
    if (!user) throw new BadRequestException('Пользователь не найден');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.getOne(id);

    if (dto.email) {
      const isSameUser = await this.getByEmail(dto.email);
      if (isSameUser && isSameUser.id != id)
        throw new BadRequestException('Данный email занят');
      user.email = dto.email;
    }

    if (user.profile) await this.profileService.update(id, dto);
    else await this.profileService.create(user.id, dto as RegisterUserDto);

    if (dto.password) user.password = await hashValue(dto.password);

    await user.save();

    return await this.getOne(id);
  }

  async delete(id: number) {
    const user = await this.userModel.findByPk(id, { include: { all: true } });
    if (!user) throw new BadRequestException('Пользователь не найден');
    if (user.profile) await this.profileService.delete(user.id);
    if (user.developerRates) {
      const rates = await this.rateModel.findAll({
        where: { developerId: user.id },
      });
      rates.forEach(async (rate) => await rate.destroy());
    }
    await user.destroy();
  }

  async addRole({ value, userId }: AddRoleToUserDto) {
    const role = await this.rolesService.getByValue(value);
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new BadRequestException('Пользователь не найден');
    await user.$add('roles', role.id);
  }
}
