import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { TeachersController } from './teachers.controller.js';
import { TeachersService } from './teachers.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [TeachersController],
  providers: [TeachersService, CloudinaryService],
  exports: [TeachersService],
})
export class TeachersModule {}
