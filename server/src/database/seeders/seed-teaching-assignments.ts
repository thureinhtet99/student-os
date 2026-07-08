import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedTeachingAssignments(
  appContext: INestApplicationContext,
) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding teaching assignments...');
    const existingAssignments =
      await prismaService.teachingAssignment.findFirst();
    if (existingAssignments) {
      console.log('Teaching assignments already exist. Skipping seeding.');
      return;
    }

    const teachers = await prismaService.teacher.findMany();
    const subjects = await prismaService.subject.findMany();
    const classes = await prismaService.class.findMany();
    const academicYear = await prismaService.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (
      teachers.length === 0 ||
      subjects.length === 0 ||
      classes.length === 0 ||
      !academicYear
    ) {
      console.log(
        'No teachers, subjects, classes, or current academic year found. Skipping teaching assignment seeding.',
      );
      return;
    }

    const assignmentsToCreate = [
      {
        teacherId: teachers[0].id,
        subjectId: subjects[0].id, // Mathematics
        classId: classes[0].id, // Grade 1A
        academicYearId: academicYear.id,
      },
      {
        teacherId: teachers[1].id,
        subjectId: subjects[1].id, // Science
        classId: classes[1].id, // Grade 1B
        academicYearId: academicYear.id,
      },
      {
        teacherId: teachers[2].id,
        subjectId: subjects[2].id, // History
        classId: classes[2].id, // Grade 2A
        academicYearId: academicYear.id,
      },
      {
        teacherId: teachers[0].id,
        subjectId: subjects[3].id, // English
        classId: classes[0].id, // Grade 1A
        academicYearId: academicYear.id,
      },
    ];

    await prismaService.teachingAssignment.createMany({
      data: assignmentsToCreate,
    });

    console.log('Teaching assignments seeded successfully!');
  } catch (error) {
    console.error('Failed to seed teaching assignments:', error);
    process.exit(1);
  }
}
