import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../users/user.model';
import { UserRolesModel } from './user.roles.model';
import { ApiProperty } from '@nestjs/swagger';

interface RolesCreationAttr {
  value: string;
  description: string;
}
@Table({ tableName: 'roles' })
export class RolesModel extends Model<RolesModel, RolesCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'ADMIN', description: 'Название роли' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING })
  description: string;

  @BelongsToMany(() => UserModel, () => UserRolesModel)
  users: UserModel[];
}
