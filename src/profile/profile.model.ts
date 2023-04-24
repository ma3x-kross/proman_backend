import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

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

  @ApiProperty({ example: 'Иванов Петр Михайлович', description: 'ФИО' })
  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @ApiProperty({ example: '+79081123541', description: 'Телефонный номер' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  phone: string;

  @ApiProperty({ example: 'login', description: 'Логин в телеграм' })
  @Column({ type: DataType.STRING, unique: true })
  telegramUsername: string;

  @ApiProperty({ example: 1, description: 'Id пользователя' })
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
