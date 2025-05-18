import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class ShiftModule {}
