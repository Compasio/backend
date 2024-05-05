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
    .addTag('User', 'Ações de Usuário')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
