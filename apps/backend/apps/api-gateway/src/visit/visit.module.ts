import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedModule } from '@app/shared';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'visit_service',
        transport: Transport.TCP,
        options: {
          host: process.env.VISIT_SERVICE_HOST || 'localhost',
          port: 4202,
        },
      },
    ]),
    SharedModule,
  ],
  controllers: [VisitController],
  providers: [JwtService],
})
export class VisitModule {}
