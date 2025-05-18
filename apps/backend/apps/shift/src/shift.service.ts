import { PrismaService } from '@app/shared';
import { User } from '@app/shared/prisma';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class ShiftService implements OnModuleInit {
  private readonly logger = new Logger(ShiftService.name);
  private serviceHealthy = false;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.prisma.$queryRaw`SELECT 1 AS connected`;
      this.serviceHealthy = true;
      this.logger.log('Shift service database connection verified');
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
   * Find Shift by User
   * @param user: Logged-in user
   * @returns Found Shift
   */
  async findOneShiftByUser(user: User) {
    try {
      if (!this.serviceHealthy) {
        await this.checkHealth();
        if (!this.serviceHealthy) {
          throw new NotFoundException('Service temporarily unavailable');
        }
      }

      if (!user || !user.id) {
        this.logger.warn('No valid user provided');
        throw new NotFoundException('User not found');
      }

      const shift = await this.prisma.shift.findFirst({
        where: { userId: user.id },
        include: {
          client: true,
          visits: true,
          caregiver: true,
        },
      });

      if (!shift) {
        this.logger.warn(`No shifts found for user ID: ${user.id}`);
        throw new NotFoundException(`No shifts found for user ID: ${user.id}`);
      }

      return shift;
    } catch (error) {
      this.logger.error(`Error finding shift for user: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Shift not found');
    }
  }
}
