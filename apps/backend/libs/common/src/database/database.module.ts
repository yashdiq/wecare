import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const prisma = new PrismaClient({
          log: ['error', 'warn'],
          errorFormat: 'pretty',
        });
        return prisma;
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaClient],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    private prisma: PrismaClient,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const retryAttempts = this.configService.get<number>(
      'DATABASE_RETRY_ATTEMPTS',
      5,
    );
    const retryDelay = this.configService.get<number>(
      'DATABASE_RETRY_DELAY',
      5000,
    );

    let currentAttempt = 0;
    let connected = false;

    while (currentAttempt < retryAttempts && !connected) {
      try {
        await this.prisma.$connect();
        connected = true;
        this.logger.log('Successfully connected to the database');

        // Verify database connection with a simple query
        await this.prisma.$queryRaw`SELECT 1 AS connected`;
        this.logger.log('Database query successful - connection verified');
      } catch (error) {
        currentAttempt++;
        this.logger.error(
          `Failed to connect to the database. Attempt ${currentAttempt}/${retryAttempts}`,
        );
        this.logger.error(`Error details: ${error.message}`);

        if (currentAttempt < retryAttempts) {
          this.logger.log(`Retrying in ${retryDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!connected) {
      this.logger.error(
        'Failed to connect to the database after maximum retry attempts',
      );
      throw new Error('Database connection failed');
    }
  }
}
