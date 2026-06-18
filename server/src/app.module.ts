import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { ClassesModule } from './modules/classes/classes.module';
import { StudentsModule } from './modules/students/students.module';
import { ParentsModule } from './modules/parents/parents.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AdminsModule } from './modules/admins/admins.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ResultsModule } from './modules/results/results.module';
import { GradesModule } from './modules/grades/grades.module';
import { EventsModule } from './modules/events/events.module';

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
    LessonsModule,
    AttendancesModule,
    AssignmentsModule,
    ExamsModule,
    ResultsModule,
    GradesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
