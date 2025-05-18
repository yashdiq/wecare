import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedModule } from '@app/shared';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'shift_service',
        transport: Transport.TCP,
        options: {
          host: process.env.SHIFT_SERVICE_HOST || 'localhost',
          port: 4201,
        },
      },
    ]),
    SharedModule,
  ],
  controllers: [ShiftController],
  providers: [JwtService],
})
export class ShiftModule {}
