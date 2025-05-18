import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  endTime: Date;
}
