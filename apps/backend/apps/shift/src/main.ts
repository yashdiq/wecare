import { NestFactory } from '@nestjs/core';
import { ShiftModule } from './shift.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ShiftModule,
    {
      transport: Transport.TCP,
      options: {
        // host: '127.0.0.1',
        host: process.env.SHIFT,
        port: 4201,
      },
    },
  );

  await app.listen();

  Logger.log(
    `🚀 Shift microservice is listening at ${process.env.HOST ?? 'localhost'}:4201`,
  );
}
bootstrap();
