import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { ParentsService } from './parents.service';

describe('ParentsService', () => {
  let service: ParentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentsService,
        {
          provide: PrismaService,
          useValue: {
            parent: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ParentsService>(ParentsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
