import { INestApplicationContext } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedResults(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding results...');
    const existingResults = await prismaService.result.findFirst();
    if (existingResults) {
      console.log('Results already exist. Skipping seeding.');
      return;
    }

    const enrollments = await prismaService.enrollment.findMany();
    const exams = await prismaService.exam.findMany();
    const academicYear = await prismaService.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (enrollments.length === 0 || exams.length === 0 || !academicYear) {
      console.log(
        'No enrollments, exams, or current academic year found. Skipping result seeding.',
      );
      return;
    }

    const resultsToCreate: Prisma.ResultCreateManyInput[] = [];
    for (const enrollment of enrollments) {
      for (const exam of exams) {
        // Check if the exam is for a subject the student is taking
        const teachingAllocation =
          await prismaService.teachingAllocation.findUnique({
            where: { id: exam.teachingAllocationId },
          });

        const studentClass = await prismaService.class.findUnique({
          where: { id: enrollment.classId },
        });

        if (
          teachingAllocation &&
          studentClass &&
          teachingAllocation.classId === studentClass.id
        ) {
          resultsToCreate.push({
            // enrollmentId: enrollment.id,
            academicYearId: academicYear.id,
            // examId: exam.id,
            score: Math.floor(Math.random() * 61) + 40, // Score between 40 and 100
          });
        }
      }
    }

    await prismaService.result.createMany({
      data: resultsToCreate,
      skipDuplicates: true,
    });

    console.log('Results seeded successfully!');
  } catch (error) {
    console.error('Failed to seed results:', error);
    process.exit(1);
  }
}
