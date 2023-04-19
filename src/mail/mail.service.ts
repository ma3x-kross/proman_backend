import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserModel } from '../users/user.model';
import { join } from 'path';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendConfirmMail(user: UserModel) {
    const urlConfirmAddress = 'ссылка';
    // Отправка почты
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Приглашение в систему Proman',
        template: join(__dirname, '/../templates', 'inviteLetter'),
        context: {
          id: user.id,
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
