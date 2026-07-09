import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { TeachingAllocationsService } from './teaching-allocations.service.js';

describe('TeachingAllocationsService', () => {
  let service: TeachingAllocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachingAllocationsService,
        {
          provide: PrismaService,
          useValue: {
            teachingAssignment: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TeachingAllocationsService>(
      TeachingAllocationsService,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
