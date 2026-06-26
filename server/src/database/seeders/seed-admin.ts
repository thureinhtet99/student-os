import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module.js';
import { UserRole } from '../../common/constants/role.constant.js';
import { AdminsService } from '../../modules/admins/admins.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

async function run() {
  const email = process.env.INIT_SUPER_ADMIN_EMAIL;
  const password = process.env.INIT_SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      'INIT_SUPER_ADMIN_EMAIL and INIT_SUPER_ADMIN_PASSWORD environment variables are not set. Skipping super admin seeding.',
    );
    return;
  }

  // Bootstrap the application context to get access to services
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const prismaService = appContext.get(PrismaService);
  const adminsService = appContext.get(AdminsService);

  try {
    const trimmedEmail = email.trim();

    // Check if the admin already exists
    const existingUser = await prismaService.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      console.log('Super admin with email already exists. Skipping seeding.');
    } else {
      console.log('Seeding super admin with email');
      await adminsService.create({
        name: 'Super Admin',
        email: trimmedEmail,
        password: password,
        role: UserRole.SUPER_ADMIN,
      });
      console.log('Super admin seeded successfully!');
    }
  } catch (error) {
    console.error('Failed to seed super admin:', error);
    process.exit(1);
  } finally {
    await appContext.close();
  }
}

run().catch((error: unknown) => {
  console.error('Unhandled error during seeding:', error);
  process.exit(1);
});
