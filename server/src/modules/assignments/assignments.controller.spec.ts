import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from './assignments.controller';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AssignmentsController,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
