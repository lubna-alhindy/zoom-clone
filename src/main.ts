import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );

  app.enableCors({
    origin: true,
    credentials: true
  });

  await app.listen(3000);

  console.log('Server is running on: http://localhost:3000');
}

bootstrap();
