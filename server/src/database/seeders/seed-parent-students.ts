import { INestApplicationContext } from '@nestjs/common';
import { ParentRelationship } from '../../../prisma/generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedParentStudents(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding parent-students...');
    const existingParentStudents =
      await prismaService.parentStudent.findFirst();
    if (existingParentStudents) {
      console.log('Parent-students already exist. Skipping seeding.');
      return;
    }

    const parents = await prismaService.parent.findMany();
    const students = await prismaService.student.findMany();

    if (parents.length === 0 || students.length === 0) {
      console.log(
        'No parents or students found. Skipping parent-student seeding.',
      );
      return;
    }

    const parentStudentsToCreate = [
      {
        parentId: parents[0].id,
        studentId: students[0].id,
        relationship: ParentRelationship.FATHER,
      },
      {
        parentId: parents[1].id,
        studentId: students[1].id,
        relationship: ParentRelationship.MOTHER,
      },
      {
        parentId: parents[2].id,
        studentId: students[2].id,
        relationship: ParentRelationship.FATHER,
      },
      {
        parentId: parents[3].id,
        studentId: students[3].id,
        relationship: ParentRelationship.MOTHER,
      },
      {
        parentId: parents[4].id,
        studentId: students[4].id,
        relationship: ParentRelationship.GUARDIAN,
      },
    ];

    await prismaService.parentStudent.createMany({
      data: parentStudentsToCreate,
    });

    console.log('Parent-students seeded successfully!');
  } catch (error) {
    console.error('Failed to seed parent-students:', error);
    process.exit(1);
  }
}
