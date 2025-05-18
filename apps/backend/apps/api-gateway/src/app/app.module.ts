import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VisitModule } from '../visit/visit.module';
import { ShiftModule } from '../shift/shift.module';

@Module({
  imports: [AuthModule, ShiftModule, VisitModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
