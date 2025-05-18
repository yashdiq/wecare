import { JwtAuthGuard } from '@app/shared/jwt-auth.guard';
import { Shift } from '@app/shared/prisma';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('shifts')
@ApiTags('shifts')
export class ShiftController {
  constructor(
    @Inject('shift_service') private readonly shiftClient: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({ type: Shift })
  async findOne(@Req() req: Request & { user: any }) {
    const user = req.user;
    const res = this.shiftClient.send('findOneShiftByUser', { user });
    const result = await lastValueFrom(res);
    return result;
  }
}
