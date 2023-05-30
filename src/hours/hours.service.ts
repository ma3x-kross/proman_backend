import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HoursModel } from './hours.model';
import { AddHoursDto } from './dto/add.hours.dto';
import { ProjectsService } from '../projects/projects.service';
import { RateModel } from '../payroll/models/rate.model';
import { Op } from 'sequelize';
import { UserModel } from '../users/user.model';
import { ProjectsModel } from '../projects/models/projects.model';
import { ProfileModel } from '../profile/profile.model';

@Injectable()
export class HoursService {
  constructor(
    @InjectModel(HoursModel) private hoursModel: typeof HoursModel,
    @InjectModel(RateModel) private rateModel: typeof RateModel,
    @InjectModel(UserModel) private userModel: typeof UserModel,
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

    const project = await this.projectService.getById(hours.projectId);

    const rate = await this.rateModel.findOne({
      where: { developerId: hours.developerId, date: { [Op.lte]: hours.date } },
      order: [['date', 'DESC']],
    });

    project.workedHours -= hours.value;
    project.salary -= hours.value * rate.value;
    await project.save();

    await hours.destroy();
  }

  reduceHoursByProject(hours: HoursModel[]) {
    return hours.reduce((acc, hour) => {
      const project = hour.project;

      const existProject = acc.find((p) => p.name === project.name);
      if (existProject) {
        existProject.hours.push({
          id: hour.id,
          value: hour.value,
          date: hour.date,
        });
      } else {
        acc.push({
          id: project.id,
          name: project.name,
          hours: [{ id: hour.id, value: hour.value, date: hour.date }],
        });
      }
      return acc;
    }, [] as { id: number; name: string; hours: { id: number; value: number; date: Date }[] }[]);
  }

  async getAllHours(start: string, end: string) {
    let where;
    if (start && end) {
      where = {
        date: { [Op.between]: [start, end] },
      };
    }
    const developers = await this.userModel.findAll({
      attributes: ['id'],
      include: [
        {
          model: ProfileModel,
          as: 'profile',
          attributes: {
            exclude: ['id', 'userId', 'phone', 'telegramUsername'],
          },
        },
        {
          model: HoursModel,
          as: 'hours',
          required: true,
          where,
          include: [
            { model: ProjectsModel, as: 'project', attributes: ['id', 'name'] },
          ],
          order: [['date', 'ASC']],
        },
      ],
    });

    return developers.map((developer) => ({
      id: developer.id,
      fullName: developer.profile.fullName,
      projects: this.reduceHoursByProject(developer.hours),
    }));
  }

  async getAllDeveloperHours(developerId: number, start: string, end: string) {
    let where: any = { developerId };

    if (start && end) {
      where.date = {
        [Op.between]: [start, end],
      };
    }

    const hours = await this.hoursModel.findAll({
      where,
      include: [
        { model: ProjectsModel, as: 'project', attributes: ['id', 'name'] },
      ],
      order: [['date', 'ASC']],
    });
    return this.reduceHoursByProject(hours);
  }

  async getById(id: number) {
    const hours = await this.hoursModel.findByPk(id);
    if (!hours) throw new BadRequestException('Отмеченные часы не найдены');
    return hours;
  }
}
