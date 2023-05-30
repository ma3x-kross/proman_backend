import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProjectsModel } from '../projects/models/projects.model';
import { UserModel } from '../users/user.model';

interface HoursCreationAttr {
  projectId: number;
  developerId: number;
  value: number;
  date: Date;
}

@Table({ tableName: 'hours', timestamps: false })
export class HoursModel extends Model<HoursModel, HoursCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  value: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: Date;

  @ForeignKey(() => ProjectsModel)
  projectId: number;

  @BelongsTo(() => ProjectsModel)
  project: ProjectsModel;

  @ForeignKey(() => UserModel)
  developerId: number;

  @BelongsTo(() => UserModel)
  developer: UserModel;
}
