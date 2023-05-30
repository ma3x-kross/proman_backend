import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RateModel } from './models/rate.model';
import { InjectModel } from '@nestjs/sequelize';
import { AddRateDto } from './dto/add.rate.dto';
import { UsersService } from '../users/users.service';
import { Op } from 'sequelize';
import { HoursModel } from '../hours/hours.model';

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(RateModel) private rateModel: typeof RateModel,
    @InjectModel(HoursModel) private hoursModel: typeof HoursModel,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async addRate(dto: AddRateDto) {
    await this.userService.getOne(dto.developerId);
    const rate = await this.rateModel.create(dto);
    return await this.userService.getOne(dto.developerId);
  }

  async calculateSalary(
    developerId: number,
    rate: number,
    start: string,
    end: string,
  ) {
    const hours = await this.hoursModel.sum('value', {
      where: {
        developerId: developerId,
        date: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
    });
    return { hours, salary: hours * rate };
  }

  async getSalary(developerId: number, start: string, end: string) {
    let salary = 0,
      hours = 0,
      rate;

    const rates = await RateModel.findAll({
      where: { developerId, date: { [Op.between]: [start, end] } },
      order: [['date', 'DESC']],
    });

    console.log(rates);

    if (rates.length === 0) {
      const lastRate = await RateModel.findOne({
        where: { developerId },
        order: [['date', 'DESC']],
      });
      rate = lastRate;
      const paysheet = await this.calculateSalary(
        developerId,
        rate.value,
        start,
        end,
      );
      salary += paysheet.salary;
      hours += paysheet.hours;
    } else {
      rate = rates;
      const temp = start;

      for (const rate of rates) {
        start = rate.date as any;
        if (start === end) {
          start = temp;
        }
        const paysheet = await this.calculateSalary(
          developerId,
          rate.value,
          start,
          end,
        );
        salary += paysheet.salary;
        hours += paysheet.hours;
        end = rate.date as any;
      }
      const firstRateBeforeStart = await this.rateModel.findOne({
        where: { developerId, date: { [Op.lt]: start } },
      });
      if (firstRateBeforeStart) {
        const paysheet = await this.calculateSalary(
          developerId,
          firstRateBeforeStart.value,
          temp,
          end,
        );
        salary += paysheet.salary;
        hours += paysheet.hours;
      }
    }

    return { rate: rate.length ? rate[0].value : rate.value, salary, hours };
  }

  async getPayRoll(start: string, end: string) {
    let where: any = {};
    if (start && end) {
      where.date = {
        [Op.between]: [start, end],
      };
    }
    let developers = await this.userService.getAll('DEVELOPER');
    developers = developers.filter((developer) => developer.profile);
    const result = await Promise.all(
      developers.map(async (developer) => {
        const paysheet = await this.getSalary(developer.id, start, end);
        return {
          id: developer.id,
          fullName: developer.profile.fullName,
          ...paysheet,
        };
      }),
    );
    return result;
  }
}
