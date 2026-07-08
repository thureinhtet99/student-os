import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedEnrollments(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding enrollments...');
    const existingEnrollments = await prismaService.enrollment.findFirst();
    if (existingEnrollments) {
      console.log('Enrollments already exist. Skipping seeding.');
      return;
    }

    const students = await prismaService.student.findMany();
    const classes = await prismaService.class.findMany();
    const academicYear = await prismaService.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (students.length === 0 || classes.length === 0 || !academicYear) {
      console.log(
        'No students, classes, or current academic year found. Skipping enrollment seeding.',
      );
      return;
    }

    const enrollmentsToCreate = students.map((student, index) => ({
      studentId: student.id,
      classId: classes[index % classes.length].id,
      academicYearId: academicYear.id,
    }));

    await prismaService.enrollment.createMany({
      data: enrollmentsToCreate,
    });

    console.log('Enrollments seeded successfully!');
  } catch (error) {
    console.error('Failed to seed enrollments:', error);
    process.exit(1);
  }
}
