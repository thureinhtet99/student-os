import { INestApplicationContext } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedAttendances(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding attendances...');
    const existingAttendances = await prismaService.attendance.findFirst();
    if (existingAttendances) {
      console.log('Attendances already exist. Skipping seeding.');
      return;
    }

    const enrollments = await prismaService.enrollment.findMany();
    const academicYear = await prismaService.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (enrollments.length === 0 || !academicYear) {
      console.log(
        'No enrollments or current academic year found. Skipping attendance seeding.',
      );
      return;
    }

    const attendancesToCreate: Prisma.AttendanceCreateManyInput[] = [];
    const today = new Date();

    for (const enrollment of enrollments) {
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        attendancesToCreate.push({
          enrollmentId: enrollment.id,
          academicYearId: academicYear.id,
          date,
          present: Math.random() > 0.1, // 90% chance of being present
        });
      }
    }

    await prismaService.attendance.createMany({
      data: attendancesToCreate,
      skipDuplicates: true,
    });

    console.log('Attendances seeded successfully!');
  } catch (error) {
    console.error('Failed to seed attendances:', error);
    process.exit(1);
  }
}
