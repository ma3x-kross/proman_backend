import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../users/user.model';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [SequelizeModule.forFeature([UserModel]), UsersModule],
})
export class AuthModule {}
