import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from '../../database/prisma/prisma.service.js';

export const ACADEMIC_YEAR_HEADER = 'x-academic-year-id';

@Injectable({ scope: Scope.REQUEST })
export class AcademicYearContextService {
  private activeAcademicYearId: string | null = null;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly prisma: PrismaService,
  ) {}

  async getActiveId(): Promise<string> {
    if (this.activeAcademicYearId) return this.activeAcademicYearId;

    const headerId = this.request.headers[ACADEMIC_YEAR_HEADER] as string;

    if (headerId) {
      const academicYear = await this.prisma.academicYear.findUnique({
        where: { id: headerId },
      });

      if (!academicYear) {
        throw new NotFoundException(
          `Academic year with ID specified in ${ACADEMIC_YEAR_HEADER} header not found.`,
        );
      }
      this.activeAcademicYearId = academicYear.id;
      return this.activeAcademicYearId;
    }

    const currentAcademicYear = await this.prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentAcademicYear) {
      throw new NotFoundException(
        'No active academic year found. Set one or pass it via header.',
      );
    }

    this.activeAcademicYearId = currentAcademicYear.id;
    return this.activeAcademicYearId;
  }
}
