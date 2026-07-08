import { NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import {
  ACADEMIC_YEAR_HEADER,
  AcademicYearContextService,
} from './academic-year-context.service';

const mockPrismaService = {
  academicYear: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
};

const mockRequest = {
  headers: {},
} as unknown as Request;

describe('AcademicYearContextService', () => {
  let service: AcademicYearContextService;
  let module: TestingModule;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AcademicYearContextService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    service = await module.resolve<AcademicYearContextService>(
      AcademicYearContextService,
    );
    prisma = module.get(PrismaService);

    // Reset mocks and request object before each test
    jest.clearAllMocks();
    mockRequest.headers = {};
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getActiveId', () => {
    it('should resolve from header when present and valid', async () => {
      const academicYear = {
        id: 'test-id',
        name: '2025-2026',
        isCurrent: false,
        startDate: new Date(),
        endDate: new Date(),
      };
      mockRequest.headers[ACADEMIC_YEAR_HEADER] = 'test-id';
      prisma.academicYear.findUnique.mockResolvedValue(academicYear);

      const result = await service.getActiveId();
      expect(result).toBe('test-id');
      expect(prisma.academicYear.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(prisma.academicYear.findFirst).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when header id does not exist', async () => {
      mockRequest.headers[ACADEMIC_YEAR_HEADER] = 'non-existent-id';
      prisma.academicYear.findUnique.mockResolvedValue(null);

      await expect(service.getActiveId()).rejects.toThrow(NotFoundException);
      await expect(service.getActiveId()).rejects.toThrow(
        `Academic year with ID specified in ${ACADEMIC_YEAR_HEADER} header not found.`,
      );
    });

    it('should fall back to isCurrent: true row when no header', async () => {
      const academicYear = {
        id: 'current-id',
        name: '2025-2026',
        isCurrent: true,
        startDate: new Date(),
        endDate: new Date(),
      };
      prisma.academicYear.findFirst.mockResolvedValue(academicYear);

      const result = await service.getActiveId();
      expect(result).toBe('current-id');
      expect(prisma.academicYear.findFirst).toHaveBeenCalledWith({
        where: { isCurrent: true },
      });
      expect(prisma.academicYear.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when no header and no current year exists', async () => {
      prisma.academicYear.findFirst.mockResolvedValue(null);

      await expect(service.getActiveId()).rejects.toThrow(NotFoundException);
      await expect(service.getActiveId()).rejects.toThrow(
        'No active academic year found. Set one or pass it via header.',
      );
    });

    it('should cache the result within the same request', async () => {
      const academicYear = {
        id: 'cached-id',
        name: '2025-2026',
        isCurrent: true,
        startDate: new Date(),
        endDate: new Date(),
      };
      prisma.academicYear.findFirst.mockResolvedValue(academicYear);

      const result1 = await service.getActiveId();
      const result2 = await service.getActiveId();

      expect(result1).toBe('cached-id');
      expect(result2).toBe('cached-id');
      expect(prisma.academicYear.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should cache the result from header within the same request', async () => {
      const academicYear = {
        id: 'header-cached-id',
        name: '2025-2026',
        isCurrent: false,
        startDate: new Date(),
        endDate: new Date(),
      };
      mockRequest.headers[ACADEMIC_YEAR_HEADER] = 'header-cached-id';
      prisma.academicYear.findUnique.mockResolvedValue(academicYear);

      const result1 = await service.getActiveId();
      const result2 = await service.getActiveId();

      expect(result1).toBe('header-cached-id');
      expect(result2).toBe('header-cached-id');
      expect(prisma.academicYear.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.academicYear.findFirst).not.toHaveBeenCalled();
    });
  });
});
