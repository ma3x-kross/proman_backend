import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../users/user.model';

interface RateCreationAttr {
  value: number;
  date: Date;
  developerId: number;
}

@Table({ tableName: 'rates', timestamps: false })
export class RateModel extends Model<RateModel, RateCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  value: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: Date;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  developerId: number;

  @BelongsTo(() => UserModel)
  developer: UserModel;
}
