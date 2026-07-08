import { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export async function seedAnnouncements(appContext: INestApplicationContext) {
  const prismaService = appContext.get(PrismaService);

  try {
    console.log('Seeding announcements...');
    const existingAnnouncements = await prismaService.announcement.findFirst();
    if (existingAnnouncements) {
      console.log('Announcements already exist. Skipping seeding.');
      return;
    }

    const classes = await prismaService.class.findMany();

    const announcementsToCreate = [
      {
        title: 'Welcome Back!',
        content: 'Welcome back to the new academic year!',
        publishedAt: new Date(),
      },
    ];

    if (classes.length > 0) {
      announcementsToCreate.push({
        title: 'Math Test Reminder',
        content: `Reminder: Math test on Friday for ${classes[0].name}.`,
        // classId: classes[0].id,
        publishedAt: new Date(),
      });
    }

    await prismaService.announcement.createMany({
      data: announcementsToCreate,
    });

    console.log('Announcements seeded successfully!');
  } catch (error) {
    console.error('Failed to seed announcements:', error);
    process.exit(1);
  }
}
