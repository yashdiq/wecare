import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create Caregiver
  const saltRounds = 10;
  const password = await bcrypt.hash('supersecret', saltRounds);
  const caregiver = await prisma.user.create({
    data: {
      email: 'caregiver@wecare.com',
      password,
      role: 'CAREGIVER',
    },
  });

  // Create Client
  const client = await prisma.client.create({
    data: {
      name: 'Jane Doe',
      address: '123 Main St, City',
    },
  });

  // Create Shift
  const shift = await prisma.shift.create({
    data: {
      date: new Date('2023-12-01'),
      startTime: new Date('2023-12-01T09:00:00'),
      endTime: new Date('2023-12-01T17:00:00'),
      clientId: client.id,
      userId: caregiver.id,
    },
  });

  console.log({
    caregiver,
    client,
    shift,
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
