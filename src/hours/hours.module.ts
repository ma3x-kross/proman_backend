import { Module } from '@nestjs/common';
import { HoursService } from './hours.service';
import { HoursController } from './hours.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { HoursModel } from './hours.model';
import { ProjectsModule } from '../projects/projects.module';
import { RateModel } from '../payroll/models/rate.model';

@Module({
  providers: [HoursService],
  controllers: [HoursController],
  imports: [
    SequelizeModule.forFeature([HoursModel, RateModel]),
    ProjectsModule,
  ],
})
export class HoursModule {}
