import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModel } from './models/roles.model';
import { UserRolesModel } from './models/user.roles.model';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [SequelizeModule.forFeature([RolesModel, UserRolesModel])],
  exports: [RolesService],
})
export class RolesModule {}
