import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import {
  ACADEMIC_YEAR_HEADER,
  AcademicYearContextService,
} from './academic-year-context.service.js';

describe('AcademicYearContextService', () => {
  let service: AcademicYearContextService;
  let prisma: {
    academicYear: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
    };
  };

  const buildRequest = (headers: Record<string, string> = {}) =>
    ({ headers }) as unknown as Request;

  beforeEach(async () => {
    prisma = {
      academicYear: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicYearContextService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: 'REQUEST' as never,
          useValue: buildRequest(),
        },
      ],
    }).compile();

    service = module.get<AcademicYearContextService>(
      AcademicYearContextService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('resolves from header when present and valid', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicYearContextService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: 'REQUEST' as never,
          useValue: buildRequest({ [ACADEMIC_YEAR_HEADER]: 'ay-123' }),
        },
      ],
    }).compile();

    const scoped = module.get<AcademicYearContextService>(
      AcademicYearContextService,
    );
    prisma.academicYear.findUnique.mockResolvedValue({ id: 'ay-123' });

    const result = await scoped.getActiveId();

    expect(result).toBe('ay-123');
    expect(prisma.academicYear.findUnique).toHaveBeenCalledWith({
      where: { id: 'ay-123' },
    });
    expect(prisma.academicYear.findFirst).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when header id does not exist', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicYearContextService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: 'REQUEST' as never,
          useValue: buildRequest({ [ACADEMIC_YEAR_HEADER]: 'missing-id' }),
        },
      ],
    }).compile();

    const scoped = module.get<AcademicYearContextService>(
      AcademicYearContextService,
    );
    prisma.academicYear.findUnique.mockResolvedValue(null);

    await expect(scoped.getActiveId()).rejects.toThrow(NotFoundException);
    await expect(scoped.getActiveId()).rejects.toThrow(/missing-id/);
  });

  it('falls back to isCurrent: true row when no header is provided', async () => {
    prisma.academicYear.findFirst.mockResolvedValue({ id: 'current-1' });

    const result = await service.getActiveId();

    expect(result).toBe('current-1');
    expect(prisma.academicYear.findFirst).toHaveBeenCalledWith({
      where: { isCurrent: true },
    });
    expect(prisma.academicYear.findUnique).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when no header and no current year exists', async () => {
    prisma.academicYear.findFirst.mockResolvedValue(null);

    await expect(service.getActiveId()).rejects.toThrow(NotFoundException);
    await expect(service.getActiveId()).rejects.toThrow(/is marked as current/);
  });

  it('caches the result so Prisma is only queried once per request', async () => {
    prisma.academicYear.findFirst.mockResolvedValue({ id: 'current-1' });

    const first = await service.getActiveId();
    const second = await service.getActiveId();

    expect(first).toBe('current-1');
    expect(second).toBe('current-1');
    expect(prisma.academicYear.findFirst).toHaveBeenCalledTimes(1);
  });
});
