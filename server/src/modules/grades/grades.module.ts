import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { GradesController } from './grades.controller.js';
import { GradesService } from './grades.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}
