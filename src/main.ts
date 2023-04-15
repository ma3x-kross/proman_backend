import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, () => console.log(`Сервер запущен на ${PORT} порте`));
}
bootstrap();
