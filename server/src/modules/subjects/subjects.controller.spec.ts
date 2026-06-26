import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsController } from './subjects.controller';

describe('SubjectsController', () => {
  let service: SubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SubjectsController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SubjectsController>(SubjectsController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
