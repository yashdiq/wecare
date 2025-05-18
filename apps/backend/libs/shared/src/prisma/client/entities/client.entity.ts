import { Shift } from '../../shift/entities/shift.entity';

export class Client {
  id: number;
  name: string;
  address: string;
  shifts?: Shift[];
  createdAt: Date;
}
