import { Controller, Logger } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ShiftController {
  private readonly logger = new Logger(ShiftController.name);

  constructor(private readonly shiftService: ShiftService) {}

  @MessagePattern('findOneShiftByUser')
  async create(@Payload() message: any) {
    this.logger.debug(`Received message payload: ${JSON.stringify(message)}`);

    try {
      const user = message.user;

      if (!user) {
        this.logger.error('No user data found in the message payload');
        throw new Error('No user data provided');
      }

      this.logger.debug(`Extracted user from payload: ${JSON.stringify(user)}`);
      return await this.shiftService.findOneShiftByUser(user);
    } catch (error) {
      this.logger.error(
        `Error processing findOneShiftByUser: ${error.message}`,
      );
      throw error;
    }
  }
}
