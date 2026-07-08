import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedSubjects(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding subjects...');
    const existingSubjects = await prismaService.subject.findFirst();
    if (existingSubjects) {
      console.log('Subjects already exist. Skipping seeding.');
      return;
    }

    const subjectsToCreate = [
      { name: 'Mathematics', description: 'Study of numbers, quantity, structure, and space.' },
      { name: 'Science', description: 'Systematic enterprise that builds and organizes knowledge.' },
      { name: 'History', description: 'Study of the past.' },
      { name: 'English', description: 'Study of English language and literature.' },
      { name: 'Art', description: 'Expression or application of human creative skill and imagination.' },
    ];

    await prismaService.subject.createMany({
      data: subjectsToCreate,
    });

    console.log('Subjects seeded successfully!');
  } catch (error) {
    console.error('Failed to seed subjects:', error);
    process.exit(1);
  }
}
