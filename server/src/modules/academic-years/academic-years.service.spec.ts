import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { AcademicYearsService } from './academic-years.service.js';

describe('AcademicYearsService', () => {
  let service: AcademicYearsService;
  let prisma: {
    academicYear: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      academicYear: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicYearsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: AcademicYearContextService,
          useValue: {
            getActiveId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AcademicYearsService>(AcademicYearsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrent', () => {
    it('returns the row with isCurrent = true', async () => {
      const current = { id: 'ay-current', isCurrent: true };
      prisma.academicYear.findFirst.mockResolvedValue(current);

      const result = await service.getCurrent();

      expect(result).toBe(current);
      expect(prisma.academicYear.findFirst).toHaveBeenCalledWith({
        where: { isCurrent: true },
      });
    });

    it('throws NotFoundException when no current year exists', async () => {
      prisma.academicYear.findFirst.mockResolvedValue(null);

      await expect(service.getCurrent()).rejects.toThrow(NotFoundException);
    });
  });

  describe('setCurrent', () => {
    it('marks the given id current inside a transaction, un-setting any previous one', async () => {
      const existing = { id: 'ay-1' };
      const updated = { id: 'ay-1', isCurrent: true };

      prisma.academicYear.findUnique.mockResolvedValue(existing);
      prisma.academicYear.updateMany.mockResolvedValue({ count: 1 });
      prisma.academicYear.update.mockResolvedValue(updated);

      prisma.$transaction.mockImplementation(
        async (work: (tx: typeof prisma) => Promise<unknown>) => work(prisma),
      );
      const result = await service.setCurrent('ay-1');

      expect(result).toBe(updated);
      expect(prisma.academicYear.findUnique).toHaveBeenCalledWith({
        where: { id: 'ay-1' },
      });
      expect(prisma.academicYear.updateMany).toHaveBeenCalledWith({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
      expect(prisma.academicYear.update).toHaveBeenCalledWith({
        where: { id: 'ay-1' },
        data: { isCurrent: true },
      });
    });

    it('throws NotFoundException when the id does not exist', async () => {
      prisma.academicYear.findUnique.mockResolvedValue(null);

      await expect(service.setCurrent('missing')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });
});
