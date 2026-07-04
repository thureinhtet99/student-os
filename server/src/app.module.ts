import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import rateLimit from 'express-rate-limit';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './common/utils/auth';
import { PrismaModule } from './database/prisma/prisma.module';
import { AcademicYearsModule } from './modules/academic-years/academic-years.module.js';
import { AdminsModule } from './modules/admins/admins.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { AuthModule as LocalAuthModule } from './modules/auth/auth.module.js';
import { ClassesModule } from './modules/classes/classes.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module.js';
import { ExamsModule } from './modules/exams/exams.module';
import { ParentsModule } from './modules/parents/parents.module';
import { ResultsModule } from './modules/results/results.module';
import { StudentsModule } from './modules/students/students.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { TeachingAssignmentsModule } from './modules/teaching-assignments/teaching-assignments.module.js';

// Rate limiter for the better-auth HTTP handler at /api/v1/auth/*.
// Nest guards and @Throttle() do not run on these routes (better-auth is
// mounted at the Express middleware layer), so the only correct hook is
// the `middleware` option on AuthModule.forRoot, which wraps the handler.
const authRateLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 5, // 10 requests/minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    error: 'Too Many Requests',
    message: 'Too many auth attempts, please slow down.',
    timestamp: new Date().toISOString(),
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000, // 1 minute
        limit: 10, // 10 times
      },
    ]),
    PrismaModule,
    StudentsModule,
    AcademicYearsModule,
    ClassesModule,
    ParentsModule,
    TeachersModule,
    AdminsModule,
    SubjectsModule,
    EnrollmentsModule,
    AttendancesModule,
    ExamsModule,
    ResultsModule,
    TeachingAssignmentsModule,
    AnnouncementsModule,
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
      middleware: (req, res, next) => authRateLimiter(req, res, next),
    }),
    LocalAuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
