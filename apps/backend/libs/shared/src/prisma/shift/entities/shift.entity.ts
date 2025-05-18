import { Client } from '../../client/entities/client.entity';
import { User } from '../../user/entities/user.entity';
import { Visit } from '../../visit/entities/visit.entity';

export class Shift {
  id: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  client?: Client;
  clientId: number;
  caregiver?: User;
  userId: number;
  visits?: Visit[];
  createdAt: Date;
}
