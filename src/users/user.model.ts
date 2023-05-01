import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { RolesModel } from '../roles/models/roles.model';
import { UserRolesModel } from '../roles/models/user.roles.model';
import { ProfileModel } from '../profile/profile.model';
import { ProjectsModel } from '../projects/models/projects.model';
import { DeveloperProjectsModel } from '../projects/models/developer.projects.model';
import { HoursModel } from '../hours/hours.model';
import { RateModel } from '../payroll/models/rate.model';

interface UserCreationAttr {
  email: string;
  activationLink: string;
  activationExpire: number;
}

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel, UserCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING })
  refreshToken: string;

  @Column({ type: DataType.STRING })
  activationLink: string;

  @Column({ type: DataType.BIGINT })
  activationExpire: number;

  @BelongsToMany(() => RolesModel, () => UserRolesModel)
  roles: RolesModel[];

  @HasOne(() => ProfileModel)
  profile: ProfileModel;

  @HasMany(() => ProjectsModel)
  projects: ProjectsModel[];

  @BelongsToMany(() => ProjectsModel, () => DeveloperProjectsModel)
  developersProjects: ProjectsModel[];

  @HasMany(() => HoursModel)
  hours: HoursModel[];

  @HasMany(() => RateModel)
  developerRates: RateModel[];
}
