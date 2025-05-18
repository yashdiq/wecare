import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  email: string;
  password: string;
  @ApiProperty({ enum: Role })
  role: Role;
}
