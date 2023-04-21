import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from './profile.model';

@Module({
  providers: [ProfileService],
  imports: [SequelizeModule.forFeature([ProfileModel])],
  exports: [ProfileService],
})
export class ProfileModule {}
