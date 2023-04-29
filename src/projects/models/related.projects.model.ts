import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProjectsModel } from './projects.model';

@Table({ tableName: 'related_projects', timestamps: false })
export class RelatedProjectsModel extends Model<RelatedProjectsModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => ProjectsModel)
  @Column({ type: DataType.INTEGER })
  sourceProjectId: number;

  @ForeignKey(() => ProjectsModel)
  @Column({ type: DataType.INTEGER })
  targetProjectId: number;
}
