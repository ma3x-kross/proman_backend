import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HoursModel } from './hours.model';
import { AddHoursDto } from './dto/add.hours.dto';
import { ProjectsService } from '../projects/projects.service';
import { RateModel } from '../payroll/models/rate.model';
import { Op } from 'sequelize';
import { UserModel } from '../users/user.model';
import { ProjectsModel } from '../projects/models/projects.model';

@Injectable()
export class HoursService {
  constructor(
    @InjectModel(HoursModel) private hoursModel: typeof HoursModel,
    @InjectModel(RateModel) private rateModel: typeof RateModel,
    private projectService: ProjectsService,
  ) {}

  async addHours(developerId: number, { projectId, value, date }: AddHoursDto) {
    const project = await this.projectService.getDevelopersProject(
      projectId,
      developerId,
    );

    const candidateHours = await this.hoursModel.findOne({
      where: { projectId, developerId, date },
    });
    if (candidateHours) {
      throw new BadRequestException(
        'В данный день по данному проекту уже есть отметка',
      );
    }
    const rate = await this.rateModel.findOne({
      where: { developerId, date: { [Op.lte]: date } },
      order: [['date', 'DESC']],
    });
    if (!rate) throw new BadRequestException('Ставка не найдена');

    const hours = await this.hoursModel.create({
      projectId,
      developerId,
      value,
      date,
    });
    project.workedHours += hours.value;
    project.salary += hours.value * rate.value;
    await project.save();
    return hours;
  }

  async deleteHours(id: number) {
    const hours = await this.getById(id);
    await hours.destroy();
  }

  async getAllHours() {
    return await this.hoursModel.findAll({
      attributes: { exclude: ['developerId', 'projectId'] },
      include: [
        { model: UserModel, as: 'developer', attributes: ['id', 'email'] },
        { model: ProjectsModel, as: 'project', attributes: ['id', 'name'] },
      ],
      order: [[{ model: ProjectsModel, as: 'project' }, 'name', 'DESC']],
    });
  }

  async getById(id: number) {
    const hours = await this.hoursModel.findByPk(id);
    if (!hours) throw new BadRequestException('Отмеченные часы не найдены');
    return hours;
  }
}
