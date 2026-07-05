import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { TeachingAssignmentsService } from './teaching-assignments.service';

describe('TeachingAssignmentsService', () => {
  let service: TeachingAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachingAssignmentsService,
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

    service = module.get<TeachingAssignmentsService>(TeachingAssignmentsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
