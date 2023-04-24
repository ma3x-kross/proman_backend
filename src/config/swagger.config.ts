import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Proman API')
  .setDescription('Документация Rest API')
  .setVersion('1.0.0')
  .addTag('Sigutin Vadim')
  .build();
