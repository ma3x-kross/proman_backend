import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserModel } from '../users/user.model';
import { join } from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  async sendConfirmMail(user: UserModel) {
    console.log(`MAILSERVICE ${user.activationLink}`);
    const urlConfirmAddress = `${this.configService.get(
      'API_URL',
    )}/api/auth/register/${user.activationLink}`;
    // Отправка почты
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Приглашение в систему Proman',
        template: join(__dirname, '/../templates', 'inviteLetter'),
        context: {
          username: user.email,
          urlConfirmAddress,
        },
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
