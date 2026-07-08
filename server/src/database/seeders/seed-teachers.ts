import { INestApplicationContext } from '@nestjs/common';
import { UserGender } from '../../../prisma/generated/prisma/client.js';
import { TeachersService } from '../../modules/teachers/teachers.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedTeachers(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);
  const teachersService = appContext.get(TeachersService);

  try {
    console.log('Seeding teachers...');
    const existingTeachers = await prismaService.teacher.findFirst();
    if (existingTeachers) {
      console.log('Teachers already exist. Skipping seeding.');
      return;
    }

    const teachersToCreate = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        gender: UserGender.FEMALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
      },
      {
        name: 'Peter Jones',
        email: 'peter.jones@example.com',
        password: 'password123',
        gender: UserGender.MALE,
        phone: null,
        address: null,
        dateOfBirth: null,
        image: null,
      },
    ];

    for (const teacherData of teachersToCreate) {
      await teachersService.create(teacherData);
    }

    console.log('Teachers seeded successfully!');
  } catch (error) {
    console.error('Failed to seed teachers:', error);
    process.exit(1);
  }
}
