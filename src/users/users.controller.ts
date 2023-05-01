import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddRoleToUserDto } from './dto/add.role.to.user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { InviteUserDto } from './dto/invite.user.dto';
import { removeExtraFromReturnedFields } from '../utils/helpers';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Auth('ADMIN')
  @Post('invite')
  async invite(@Body() dto: InviteUserDto) {
    return await this.userService.invite(dto);
  }

  @Auth('ADMIN', 'MANAGER')
  @Get()
  async getAll(@Query('role') role: string) {
    const users = await this.userService.getAll(role);
    return users;
  }

  @Auth('ADMIN', 'MANAGER')
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.userService.getOne(id);
  }

  @Auth()
  @Get('/get/self')
  async getSelf(@User('id') id: number) {
    return await this.userService.getOne(id);
  }

  @Auth('ADMIN')
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return await this.userService.update(id, dto);
  }

  @Auth()
  @Put('update/self')
  async updateSelf(@User('id') id: number, @Body() dto: UpdateUserDto) {
    return removeExtraFromReturnedFields(
      await this.userService.update(id, dto),
    );
  }

  @Auth('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }

  @Auth()
  @Delete('delete/self')
  async deleteSelf(@User('id') id: number) {
    await this.userService.delete(id);
  }

  @Auth('ADMIN')
  @Post('add-role')
  async addRole(@Body() dto: AddRoleToUserDto) {
    await this.userService.addRole(dto);
  }
}
