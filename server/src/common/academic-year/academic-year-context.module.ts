import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { AcademicYearContextService } from './academic-year-context.service.js';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AcademicYearContextService],
  exports: [AcademicYearContextService],
})
export class AcademicYearContextModule {}
