import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAllocationsController } from './teaching-allocations.controller';
import { TeachingAllocationsService } from './teaching-allocations.service';

describe('TeachingAllocationsController', () => {
  let controller: TeachingAllocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingAllocationsController],
      providers: [
        {
          provide: TeachingAllocationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeachingAllocationsController>(
      TeachingAllocationsController,
    );
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
