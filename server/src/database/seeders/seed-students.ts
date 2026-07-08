import { INestApplicationContext } from '@nestjs/common';
import { UserGender } from '../../../prisma/generated/prisma/client.js';
import { UserRole } from '../../common/constants/role.constant.js';
import { StudentsService } from '../../modules/students/students.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedStudents(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);
  const studentsService = appContext.get(StudentsService);

  try {
    console.log('Seeding students...');
    const existingStudents = await prismaService.student.findFirst();
    if (existingStudents) {
      console.log('Students already exist. Skipping seeding.');
      return;
    }

    const studentsToCreate = [
      {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        password: 'password123',
        role: UserRole.STUDENT,
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parentId: null,
        classId: null,
        newParentName: null,
        newParentPhone: null,
        newParentAddress: null,
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        password: 'password123',
        role: UserRole.STUDENT,
        gender: UserGender.FEMALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parentId: null,
        classId: null,
        newParentName: null,
        newParentPhone: null,
        newParentAddress: null,
      },
      {
        name: 'Christopher Wilson',
        email: 'christopher.wilson@example.com',
        password: 'password123',
        role: UserRole.STUDENT,
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parentId: null,
        classId: null,
        newParentName: null,
        newParentPhone: null,
        newParentAddress: null,
      },
      {
        name: 'Jessica Martinez',
        email: 'jessica.martinez@example.com',
        password: 'password123',
        role: UserRole.STUDENT,
        gender: UserGender.FEMALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parentId: null,
        classId: null,
        newParentName: null,
        newParentPhone: null,
        newParentAddress: null,
      },
      {
        name: 'David Anderson',
        email: 'david.anderson@example.com',
        password: 'password123',
        role: UserRole.STUDENT,
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
        parentId: null,
        classId: null,
        newParentName: null,
        newParentPhone: null,
        newParentAddress: null,
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
