import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/user.model';

interface ProfileCreationAttr {}

@Table({ tableName: 'profile', createdAt: false, updatedAt: false })
export class ProfileModel extends Model<ProfileModel, ProfileCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  phone: string;

  @Column({ type: DataType.STRING, unique: true })
  telegramUsername: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
