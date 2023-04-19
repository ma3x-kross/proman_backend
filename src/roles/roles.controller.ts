import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create.role.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return await this.rolesService.create(dto);
  }

  @Get('/:value')
  async getByValue(@Param('value') value: string) {
    return await this.rolesService.getByValue(value);
  }

  @Delete('/:value')
  async delete(@Param('value') value: string) {
    await this.rolesService.delete(value);
  }
}
