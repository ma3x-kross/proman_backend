import { Body, Controller, Post } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { AddRateDto } from './dto/add.rate.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('payroll')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Auth('ADMIN')
  @Post('rate')
  async addRate(@Body() dto: AddRateDto) {
    return await this.payrollService.addRate(dto);
  }
}
