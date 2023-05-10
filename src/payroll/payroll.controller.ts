import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { AddRateDto } from './dto/add.rate.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { start } from 'repl';

@Controller('payroll')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Auth('ADMIN')
  @Post('rate')
  async addRate(@Body() dto: AddRateDto) {
    return await this.payrollService.addRate(dto);
  }

  @Auth('ADMIN')
  @Get()
  async getPayroll(@Query('start') start: string, @Query('end') end: string) {
    return await this.payrollService.getPayRoll(start, end);
  }
}
