import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }
}
