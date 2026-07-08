import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../../database/prisma/prisma.service.js';

export const ACADEMIC_YEAR_HEADER = 'x-academic-year-id';

@Injectable({ scope: Scope.REQUEST })
export class AcademicYearContextService {
  private cachedId?: string;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly prisma: PrismaService,
  ) {}

  async getActiveId(): Promise<string> {
    if (this.cachedId !== undefined) return this.cachedId;

    const headerValue = this.request.headers[ACADEMIC_YEAR_HEADER];
    const headerId = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    if (headerId) {
      const academicYear = await this.prisma.academicYear.findUnique({
        where: { id: headerId },
      });

      if (!academicYear) {
        throw new NotFoundException(
          `Academic year with id "${headerId}" from header "${ACADEMIC_YEAR_HEADER}" is not found`,
        );
      }

      this.cachedId = academicYear.id;
      return this.cachedId;
    }

    const currentAcademicYear = await this.prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentAcademicYear) {
      throw new NotFoundException(
        `No academic year is marked as current and no "${ACADEMIC_YEAR_HEADER}" header was provided`,
      );
    }

    this.cachedId = currentAcademicYear.id;
    return this.cachedId;
  }
}
