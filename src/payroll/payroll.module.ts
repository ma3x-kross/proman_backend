import { forwardRef, Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RateModel } from './models/rate.model';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [PayrollService],
  controllers: [PayrollController],
  imports: [
    SequelizeModule.forFeature([RateModel]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  exports: [PayrollService],
})
export class PayrollModule {}
