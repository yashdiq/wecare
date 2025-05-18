import { JwtAuthGuard } from '@app/shared/jwt-auth.guard';
import { CreateVisitDto, Visit } from '@app/shared/prisma';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('visits')
@ApiTags('visits')
export class VisitController {
  constructor(
    @Inject('visit_service') private readonly visitClient: ClientProxy,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Visit })
  async create(
    @Req() req: Request & { user: any },
    @Body() body: CreateVisitDto,
  ) {
    const user = req.user;
    const res = this.visitClient.send('createVisit', { user, body });
    const result = await lastValueFrom(res);
    return result;
  }
}
