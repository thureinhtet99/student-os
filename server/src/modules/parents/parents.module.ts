import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { ParentsController } from './parents.controller.js';
import { ParentsService } from './parents.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}
