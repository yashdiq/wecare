import { NestFactory } from '@nestjs/core';
import { VisitModule } from './visit.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    VisitModule,
    {
      transport: Transport.TCP,
      options: {
        // host: '127.0.0.1',
        host: process.env.VISIT,
        port: 4202,
      },
    },
  );

  await app.listen();

  Logger.log(
    `🚀 Visit microservice is listening at ${process.env.HOST ?? 'localhost'}:4202`,
  );
}
bootstrap();
