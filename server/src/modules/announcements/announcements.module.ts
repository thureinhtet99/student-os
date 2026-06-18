import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AnnouncementsController } from './announcements.controller.js';
import { AnnouncementsService } from './announcements.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
