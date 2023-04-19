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

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([UserModel, RolesModel, UserRolesModel]),
    forwardRef(() => AuthModule),
    RolesModule,
    MailModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
