import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { TeachingAssignmentsController } from './teaching-assignments.controller.js';
import { TeachingAssignmentsService } from './teaching-assignments.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [TeachingAssignmentsController],
  providers: [TeachingAssignmentsService],
  exports: [TeachingAssignmentsService],
})
export class TeachingAssignmentsModule {}
