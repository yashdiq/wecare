import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}
