import { Controller } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto, User } from '@app/shared/prisma';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @MessagePattern('createVisit')
  create(@Payload('user') user: User, @Payload('body') body: CreateVisitDto) {
    return this.visitService.create(user, body);
  }
}
