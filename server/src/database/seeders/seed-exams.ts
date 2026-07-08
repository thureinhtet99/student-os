import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedExams(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding exams...');
    const existingExams = await prismaService.exam.findFirst();
    if (existingExams) {
      console.log('Exams already exist. Skipping seeding.');
      return;
    }

    const teachingAssignments =
      await prismaService.teachingAssignment.findMany();
    const academicYear = await prismaService.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (teachingAssignments.length === 0 || !academicYear) {
      console.log(
        'No teaching assignments or current academic year found. Skipping exam seeding.',
      );
      return;
    }

    const examsToCreate = [
      {
        title: 'Mid-term Mathematics',
        description: 'Mid-term exam for Mathematics.',
        totalMarks: 100,
        passMarks: 40,
        startTime: new Date('2024-03-15T09:00:00Z'),
        endTime: new Date('2024-03-15T11:00:00Z'),
        teachingAssignmentId: teachingAssignments[0].id,
        academicYearId: academicYear.id,
      },
      {
        title: 'Mid-term Science',
        description: 'Mid-term exam for Science.',
        totalMarks: 100,
        passMarks: 40,
        startTime: new Date('2024-03-16T09:00:00Z'),
        endTime: new Date('2024-03-16T11:00:00Z'),
        teachingAssignmentId: teachingAssignments[1].id,
        academicYearId: academicYear.id,
      },
    ];

    await prismaService.exam.createMany({
      data: examsToCreate,
    });

    console.log('Exams seeded successfully!');
  } catch (error) {
    console.error('Failed to seed exams:', error);
    process.exit(1);
  }
}
