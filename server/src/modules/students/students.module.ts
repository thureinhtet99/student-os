import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [PrismaModule],
  controllers: [StudentsController],
  providers: [StudentsService, CloudinaryService],
})
export class StudentsModule {}
