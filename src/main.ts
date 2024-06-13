import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API - Compasio')
    .setDescription('APIs do Projeto da S.A. Compasio')
    .setContact('Compasio', 'https://github.com/Compasio', '')
    .setVersion('0.1')
    .addTag('Auth', 'Autenticação do Sistema')
    .addTag('Voluntary', 'Ações de Voluntários')
    .addTag('Ong', 'Ações de Ong')
    .addTag('Ong-Associates', 'Ações de Associados de Ongs')
    .addTag('Voluntary-Relations', 'Ações de Relação Entre Voluntários e Ongs')
    .addTag('Projects', 'Ações de Projetos')
    .addTag('Donations', 'Ações de Doações')
    .addTag('Maps', 'Ações de endereço e api maps')
    .addTag('Sys', 'Ações de Sistema')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(9000);
}
bootstrap();
