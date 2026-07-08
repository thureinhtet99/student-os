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

    const academicYear = await prismaService.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!academicYear) {
      console.log('No current academic year found. Skipping class seeding.');
      return;
    }

    const classesToCreate = [
      { name: 'Grade 1A', academicYearId: academicYear.id },
      { name: 'Grade 1B', academicYearId: academicYear.id },
      { name: 'Grade 2A', academicYearId: academicYear.id },
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
