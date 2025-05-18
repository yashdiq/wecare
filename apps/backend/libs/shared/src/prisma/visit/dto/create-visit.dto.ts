import { ApiProperty } from '@nestjs/swagger';

export class CreateVisitDto {
  @ApiProperty()
  shiftId?: number;
  @ApiProperty()
  type: string;
  @ApiProperty()
  timestamp: Date;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
}
