import { Module } from '@nestjs/common';
import { AcademicYearContextModule } from '../../common/academic-year-context/academic-year-context.module.js';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { TeachersController } from './teachers.controller.js';
import { TeachersService } from './teachers.service.js';

@Module({
  imports: [PrismaModule, AcademicYearContextModule],
  controllers: [TeachersController],
  providers: [TeachersService, CloudinaryService],
  exports: [TeachersService],
})
export class TeachersModule {}
