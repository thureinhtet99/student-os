import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './common/utils/auth';
import { PrismaModule } from './database/prisma/prisma.module';
import { AdminsModule } from './modules/admins/admins.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { AuthModule as LocalAuthModule } from './modules/auth/auth.module.js';
import { ClassesModule } from './modules/classes/classes.module';
import { EventsModule } from './modules/events/events.module';
import { ExamsModule } from './modules/exams/exams.module';
import { GradesModule } from './modules/grades/grades.module';
import { ParentsModule } from './modules/parents/parents.module';
import { ResultsModule } from './modules/results/results.module';
import { StudentsModule } from './modules/students/students.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { TeachersModule } from './modules/teachers/teachers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StudentsModule,
    ClassesModule,
    ParentsModule,
    TeachersModule,
    AdminsModule,
    SubjectsModule,
    AttendancesModule,
    AssignmentsModule,
    ExamsModule,
    ResultsModule,
    GradesModule,
    EventsModule,
    AnnouncementsModule,
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    LocalAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
