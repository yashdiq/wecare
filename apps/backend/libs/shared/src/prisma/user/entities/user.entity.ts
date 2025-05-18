import { Role } from '@prisma/client';
import { Shift } from '../../shift/entities/shift.entity';

export class User {
  id: number;
  email: string;
  password: string;
  role: Role;
  shifts?: Shift[];
  createdAt: Date;
}
