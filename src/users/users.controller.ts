import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddRoleToUserDto } from './dto/add.role.to.user.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Auth('ADMIN', 'MANAGER')
  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }

  @Post('add-role')
  async addRole(@Body() dto: AddRoleToUserDto) {
    await this.userService.addRole(dto);
  }
}
