import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { RtJwtAuthGuard } from './guard/rt.guard';
import { Request, Response } from 'express';
import { UserWithTokens } from './interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('register/:link')
  async redirect(@Param('link') link: string, @Res() res: Response) {
    return res.redirect(
      `${this.configService.get('CLIENT_URL')}/registration/${link}`,
    );
  }

  @Post('register/:link')
  async register(
    @Body() dto: any,
    @Param('link') link: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, ...user } =
      await this.authService.register(dto, link);
    res.cookie('refresh', refreshToken, { httpOnly: true });
    return { user, accessToken };
  }

  // @Post('register')
  // async register(
  //   @Body() dto: RegisterUserDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const { accessToken, refreshToken, ...user } =
  //     await this.authService.register(dto);
  //   res.cookie('refresh', refreshToken, { httpOnly: true });
  //   return { ...user, accessToken };
  // }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, ...user } = await this.authService.login(
      dto,
    );
    res.cookie('refresh', refreshToken, { httpOnly: true });
    return { user, accessToken };
  }

  @UseGuards(RtJwtAuthGuard)
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, ...user } = req.user as UserWithTokens;
    res.cookie('refresh', refreshToken, { httpOnly: true });
    return { ...user, accessToken };
  }

  @UseGuards(RtJwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, ...user } = req.user as UserWithTokens;
    await this.authService.logout(user.email, refreshToken);
    res.clearCookie('refresh');
    return null;
  }
}
