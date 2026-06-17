import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AttendancesController } from './attendances.controller.js';
import { AttendancesService } from './attendances.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AttendancesController],
  providers: [AttendancesService],
  exports: [AttendancesService],
})
export class AttendancesModule {}
