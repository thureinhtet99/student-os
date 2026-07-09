import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
// import { ResultsController } from './results.controller.js';
// import { ResultsService } from './results.service.js';

@Module({
  imports: [PrismaModule],
  // controllers: [ResultsController],
  // providers: [ResultsService],
  // exports: [ResultsService],
})
export class ResultsModule {}
