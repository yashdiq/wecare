import { PrismaService } from '@app/shared';
import { CreateVisitDto, User } from '@app/shared/prisma';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class VisitService implements OnModuleInit {
  private readonly logger = new Logger(VisitService.name);
  private serviceHealthy = false;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.prisma.$queryRaw`SELECT 1 AS connected`;
      this.serviceHealthy = true;
      this.logger.log('Visit service database connection verified');
    } catch (error) {
      this.logger.error(`Database connection issue: ${error.message}`);
    }
  }

  /**
   * Check if the service is healthy (has database connectivity)
   */
  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1 as health_check`;
      this.serviceHealthy = true;
      return { status: 'ok', timestamp: new Date().toISOString() };
    } catch (error) {
      this.serviceHealthy = false;
      this.logger.error(`Health check failed: ${error.message}`);
      return {
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Insert new Visit with associated shift
   * @param user: Logged-in user
   * @param dto: Values to be inserted
   * @returns Inserted Visit
   */
  async create(user: User, dto: CreateVisitDto) {
    try {
      if (!this.serviceHealthy) {
        await this.checkHealth();
        if (!this.serviceHealthy) {
          throw new HttpException(
            'Service temporarily unavailable',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
      }

      if (!user || !user.id) {
        this.logger.warn('No valid user provided');
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (!dto || !dto.shiftId) {
        this.logger.warn('Invalid visit data provided');
        throw new HttpException('Invalid visit data', HttpStatus.BAD_REQUEST);
      }

      // Verify shift exists and belongs to user
      const shift = await this.prisma.shift.findFirst({
        where: {
          id: dto.shiftId,
          userId: user.id,
        },
      });

      if (!shift) {
        this.logger.warn(`Shift ${dto.shiftId} not found for user ${user.id}`);
        throw new HttpException(
          'Shift not found for this user',
          HttpStatus.NOT_FOUND,
        );
      }

      const data = dto as Prisma.VisitCreateInput;

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
      this.logger.error(`Error creating visit: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
