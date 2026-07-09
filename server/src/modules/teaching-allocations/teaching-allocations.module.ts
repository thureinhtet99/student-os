import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { TeachingAllocationsController } from './teaching-allocations.controller.js';
import { TeachingAllocationsService } from './teaching-allocations.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [TeachingAllocationsController],
  providers: [TeachingAllocationsService],
  exports: [TeachingAllocationsService],
})
export class TeachingAllocationModule {}
