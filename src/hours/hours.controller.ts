import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { HoursService } from './hours.service';
import { AddHoursDto } from './dto/add.hours.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../users/decorators/user.decorator';

@Controller('hours')
export class HoursController {
  constructor(private hoursService: HoursService) {}

  @Auth()
  @Post()
  async addHours(@User('id') id: number, @Body() dto: AddHoursDto) {
    return await this.hoursService.addHours(id, dto);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.hoursService.deleteHours(id);
  }

  @Get()
  async getAllHours(@Query('start') start: string, @Query('end') end: string) {
    return await this.hoursService.getAllHours(start, end);
  }

  @Get('developer/:id')
  async getAllDeveloperHours(
    @Param('id') id: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.hoursService.getAllDeveloperHours(id, start, end);
  }
}
