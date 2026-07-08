import { Test, TestingModule } from '@nestjs/testing';
import { AcademicYearContextService } from '../../common/academic-year/academic-year-context.service.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { ClassesService } from './classes.service';

describe('ClassesService', () => {
  let service: ClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: PrismaService,
          useValue: {
            class: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: AcademicYearContextService,
          useValue: {
            getActiveId: jest.fn().mockResolvedValue('academic-year-id'),
          },
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
