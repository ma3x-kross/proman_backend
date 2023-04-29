import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModel } from './users/user.model';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RolesModel } from './roles/models/roles.model';
import { UserRolesModel } from './roles/models/user.roles.model';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from './config/mail.config';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { ProfileModel } from './profile/profile.model';
import { ProjectsModule } from './projects/projects.module';
import { ProjectsModel } from './projects/models/projects.model';
import { DeveloperProjectsModel } from './projects/models/developer.projects.model';
import { RelatedProjectsModel } from './projects/models/related.projects.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        UserModel,
        RolesModel,
        UserRolesModel,
        ProfileModel,
        ProjectsModel,
        DeveloperProjectsModel,
        RelatedProjectsModel,
      ],
      autoLoadModels: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    MailModule,
    ProfileModule,
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
