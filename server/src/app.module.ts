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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
