import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedParents(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding parents...');
    const existingParents = await prismaService.parent.findFirst();
    if (existingParents) {
      console.log('Parents already exist. Skipping seeding.');
      return;
    }

    const parentsToCreate = [
      { name: 'Robert Brown', phone: '111-222-3333' },
      { name: 'Maria Davis', phone: '222-333-4444' },
      { name: 'Charles Wilson', phone: '333-444-5555' },
      { name: 'Linda Martinez', phone: '444-555-6666' },
      { name: 'James Anderson', phone: '555-666-7777' },
    ];

    await prismaService.parent.createMany({
      data: parentsToCreate,
    });

    console.log('Parents seeded successfully!');
  } catch (error) {
    console.error('Failed to seed parents:', error);
    process.exit(1);
  }
}
