import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module.js';
import { seedAcademicYears } from './seed-academic-years.js';
import { seedAdmin } from './seed-admin.js';
import { seedAnnouncements } from './seed-announcements.js';
import { seedAttendances } from './seed-attendances.js';
import { seedClasses } from './seed-classes.js';
import { seedEnrollments } from './seed-enrollments.js';
import { seedExams } from './seed-exams.js';
import { seedParentStudents } from './seed-parent-students.js';
import { seedParents } from './seed-parents.js';
import { seedResults } from './seed-results.js';
import { seedStudents } from './seed-students.js';
import { seedSubjects } from './seed-subjects.js';
import { seedTeachers } from './seed-teachers.js';
import { seedTeachingAllocations } from './seed-teaching-allocations.js';

async function main() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    await seedAdmin(appContext);
    await seedAcademicYears(appContext);
    await seedSubjects(appContext);
    await seedTeachers(appContext);
    await seedStudents(appContext);
    await seedParents(appContext);
    await seedParentStudents(appContext);
    await seedClasses(appContext);
    await seedEnrollments(appContext);
    await seedTeachingAllocations(appContext);
    await seedAnnouncements(appContext);
    await seedExams(appContext);
    await seedAttendances(appContext);
    await seedResults(appContext);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await appContext.close();
  }
}

main().catch((error) => {
  console.error('Unhandled error during seeding:', error);
  process.exit(1);
});
