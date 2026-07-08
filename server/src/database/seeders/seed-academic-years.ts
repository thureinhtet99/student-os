import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedAcademicYears(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding academic years...');
    const existingAcademicYear = await prismaService.academicYear.findFirst();
    if (existingAcademicYear) {
      console.log('Academic year already exists. Skipping seeding.');
      return;
    }

    await prismaService.academicYear.create({
      data: {
        name: '2023-2024',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2024-06-30'),
        isCurrent: true,
      },
    });
    console.log('Academic years seeded successfully!');
  } catch (error) {
    console.error('Failed to seed academic years:', error);
    process.exit(1);
  }
}
