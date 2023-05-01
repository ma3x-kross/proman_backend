import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsModel } from './models/projects.model';
import { UserModel } from '../users/user.model';
import { DeveloperProjectsModel } from './models/developer.projects.model';
import { RelatedProjectsModel } from './models/related.projects.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ProjectsService],
  controllers: [ProjectsController],
  imports: [
    SequelizeModule.forFeature([
      ProjectsModel,
      UserModel,
      DeveloperProjectsModel,
      RelatedProjectsModel,
    ]),
    AuthModule,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
