import { Controller } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { User } from '@app/shared/prisma';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @MessagePattern('findOneShiftByUser')
  create(@Payload('user') user: User) {
    return this.shiftService.findOneShiftByUser(user);
  }
}
