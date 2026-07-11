import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);


  app.enableCors();


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  const config = new DocumentBuilder()
    .setTitle('Booking Platform REST API')
    .setDescription(
      'EN2H NestJS technical assignment API.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();


  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );


  SwaggerModule.setup(
    'api',
    app,
    document,
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );


  await app.listen(
    process.env.PORT ?? 3000,
  );
}

bootstrap();