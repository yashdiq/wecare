import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
}
