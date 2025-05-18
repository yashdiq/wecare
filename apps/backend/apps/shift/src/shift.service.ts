import { PrismaService } from '@app/shared';
import { User } from '@app/shared/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  /**
   * Insert new Shift
   * @param user: Logged-in user
   * @param dto: Values to be inserted
   * @returns Inserted Shift
   */
  async findOneShiftByUser(user: User) {
    return await this.prisma.shift.findFirstOrThrow({
      where: { userId: user.id },
      include: {
        client: true,
        visits: true,
        caregiver: true,
      },
    });
  }
}
