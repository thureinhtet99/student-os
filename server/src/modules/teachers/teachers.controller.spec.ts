import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from './teachers.controller';

describe('TeachersController', () => {
  let service: TeachersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TeachersController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TeachersController>(TeachersController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
