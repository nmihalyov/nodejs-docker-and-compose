import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { nestCsrf } from 'ncsrf';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

const corsConfig = {
  credetials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: ['http://localhost:3000', 'http://localhost:3001'],
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.set('etag', 'weak');
  app.use(helmet());
  app.use(cookieParser());
  app.use(nestCsrf());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('КупиПодариДай')
    .setVersion('1.0')
    .setDescription('API сервиса вишлистов')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
