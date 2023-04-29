import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../users/user.model';
import { DeveloperProjectsModel } from './developer.projects.model';
import { RelatedProjectsModel } from './related.projects.model';

export enum ProjectStatus {
  NEGOTIATION = 'Переговоры',
  DESIGN_DRAWING = 'Отрисовка дизайна',
  DESIGN_STATEMENT = 'Утверждение дизайна',
  PROGRAMMING_START = 'Старт программирования',
  BURN = 'Горит',
  OS_WAITING = 'Ждем ОС клиента',
  INSTRUCTIONS_WRITING = 'Пишем инструкцию',
  TESTING = 'Внутрненне тестирование',
  EDIT = 'Вносим правки',
  ADVERTISING = 'Реклама',
  TECHNICAL_SUPPORT = 'Техподдержка',
  CLOSED = 'Закрыт',
  SEND_FOR_DEVELOPMENT = 'Отдать в разработку',
  EXTRA_SALE_SUGGESTING = 'Предложить доп. продажу',
  WAITING_FOR_PAYMENT = 'Ждем оплату',
  PROJECT_DISCUSS = 'Обсудить проект',
  SUSPENDED = 'Приостановлен',
}

interface ProjectsCreationAttr {
  name: string;
  status: string;
  deadline: Date;
  plannedHours: number;
  rate: number;
}

@Table({ tableName: 'projects' })
export class ProjectsModel extends Model<ProjectsModel, ProjectsCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    allowNull: false,
  })
  status: ProjectStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  deadline: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  plannedHours: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  workedHours: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  salary: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  rate: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.getDataValue('workedHours') * this.getDataValue('rate');
    },
  })
  cost: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return (
        this.getDataValue('workedHours') * this.getDataValue('rate') -
        this.getDataValue('salary')
      );
    },
  })
  profit: number;

  @ForeignKey(() => UserModel)
  managerId: number;

  @BelongsTo(() => UserModel)
  manager: UserModel;

  @BelongsToMany(() => UserModel, () => DeveloperProjectsModel)
  developers: UserModel[];

  @BelongsToMany(
    () => ProjectsModel,
    () => RelatedProjectsModel,
    'sourceProjectId',
    'targetProjectId',
  )
  relatedProjects: ProjectsModel[];
}
