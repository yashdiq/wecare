import { ApiProperty } from '@nestjs/swagger';
import { Shift } from '../../shift/entities/shift.entity';

export class Visit {
  @ApiProperty()
  id: number;
  @ApiProperty()
  type: string;
  @ApiProperty()
  timestamp: Date;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  shift?: Shift;
  @ApiProperty()
  shiftId: number;
  @ApiProperty()
  createdAt: Date;
}
