import { PrismaService } from '@app/shared';
import { CreateVisitDto, User } from '@app/shared/prisma';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  /**
   * Insert new Visit with associated shift
   * @param user: Logged-in user
   * @param dto: Values to be inserted
   * @returns Inserted Visit
   */
  async create(user: User, dto: CreateVisitDto) {
    const data = dto as Prisma.VisitCreateInput;

    try {
      const visit = await this.prisma.visit.create({
        data: {
          ...data,
        },
      });

      return {
        status: true,
        data: visit,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
