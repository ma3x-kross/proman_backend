import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../users/user.model';
import { ProjectsModel } from './projects.model';

@Table({ tableName: 'developer_projects', timestamps: false })
export class DeveloperProjectsModel extends Model<DeveloperProjectsModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => ProjectsModel)
  @Column({ type: DataType.INTEGER })
  projectId: number;
}
