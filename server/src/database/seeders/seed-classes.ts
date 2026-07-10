import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedClasses(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding classes...');
    const existingClasses = await prismaService.class.findFirst();
    if (existingClasses) {
      console.log('Classes already exist. Skipping seeding.');
      return;
    }

    const classesToCreate = [
      { name: 'Grade 1A' },
      { name: 'Grade 1B' },
      { name: 'Grade 2A' },
    ];

    await prismaService.class.createMany({
      data: classesToCreate,
    });

    console.log('Classes seeded successfully!');
  } catch (error) {
    console.error('Failed to seed classes:', error);
    process.exit(1);
  }
}
