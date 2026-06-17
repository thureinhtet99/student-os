import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [PrismaModule],
  controllers: [StudentsController],
  providers: [StudentsService, CloudinaryService],
  exports: [StudentsService],
})
export class StudentsModule {}
