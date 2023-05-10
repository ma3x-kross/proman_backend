import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { RolesModel } from '../roles/models/roles.model';
import { UserRolesModel } from '../roles/models/user.roles.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ProfileModule } from '../profile/profile.module';
import { PayrollModule } from '../payroll/payroll.module';
import { RateModel } from '../payroll/models/rate.model';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      RolesModel,
      UserRolesModel,
      RateModel,
    ]),
    forwardRef(() => AuthModule),
    RolesModule,
    MailModule,
    ProfileModule,
    forwardRef(() => PayrollModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
