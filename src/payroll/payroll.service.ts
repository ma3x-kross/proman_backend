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

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(RateModel) private rateModel: typeof RateModel,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async addRate(dto: AddRateDto) {
    await this.userService.getOne(dto.developerId);
    const rate = await this.rateModel.create(dto);
    return rate;
  }
}
