import { INestApplicationContext } from '@nestjs/common';
import { UserGender } from '../../../prisma/generated/prisma/client.js';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { CreateStudentDto } from '../../modules/students/dto/create-student.dto.js';
import { StudentsService } from '../../modules/students/students.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedStudents(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);
  const studentsService = appContext.get(StudentsService);
  const academicYearContextService = appContext.get(AcademicYearContextService);
  const effectiveAcademicYearId =
    await academicYearContextService.getActiveId();

  try {
    console.log('Seeding students...');
    const existingStudents = await prismaService.student.findFirst();
    if (existingStudents) {
      console.log('Students already exist. Skipping seeding.');
      return;
    }

    if (!effectiveAcademicYearId)
      throw new Error(
        'No current academic year found. Seed academic years first.',
      );

    const studentsToCreate: CreateStudentDto[] = [
      {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        password: 'password123',
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parent: {
          name: 'parent-1',
          phone: '123123123',
          address: 'Yangon',
        },
        class: {
          name: 'class-1',
        },
        academicYearId: effectiveAcademicYearId,
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        password: 'password123',
        gender: UserGender.FEMALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parent: {
          name: 'parent-1',
          phone: '123123123',
          address: 'Yangon',
        },
        class: {
          name: 'class-1',
        },
        academicYearId: effectiveAcademicYearId,
      },
      {
        name: 'Christopher Wilson',
        email: 'christopher.wilson@example.com',
        password: 'password123',
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parent: {
          name: 'parent-1',
          phone: '123123123',
          address: 'Yangon',
        },
        class: {
          name: 'class-1',
        },
        academicYearId: effectiveAcademicYearId,
      },
      {
        name: 'Jessica Martinez',
        email: 'jessica.martinez@example.com',
        password: 'password123',
        gender: UserGender.FEMALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parent: {
          name: 'parent-1',
          phone: '123123123',
          address: 'Yangon',
        },
        class: {
          name: 'class-1',
        },
        academicYearId: effectiveAcademicYearId,
      },
      {
        name: 'David Anderson',
        email: 'david.anderson@example.com',
        password: 'password123',
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parent: {
          name: 'parent-1',
          phone: '123123123',
          address: 'Yangon',
        },
        class: {
          name: 'class-1',
        },
        academicYearId: effectiveAcademicYearId,
      },
    ];

    for (const studentData of studentsToCreate) {
      await studentsService.create(studentData);
    }

    console.log('Students seeded successfully!');
  } catch (error) {
    console.error('Failed to seed students:', error);
    process.exit(1);
  }
}
