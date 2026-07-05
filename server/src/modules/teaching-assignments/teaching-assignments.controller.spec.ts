import { Test, TestingModule } from '@nestjs/testing';
import { TeachingAssignmentsController } from './teaching-assignments.controller';
import { TeachingAssignmentsService } from './teaching-assignments.service';

describe('TeachingAssignmentsController', () => {
  let controller: TeachingAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingAssignmentsController],
      providers: [
        {
          provide: TeachingAssignmentsService,
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

    controller = module.get<TeachingAssignmentsController>(
      TeachingAssignmentsController,
    );
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
