import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';

describe('ResultsController', () => {
  let service: ResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ResultsController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ResultsController>(ResultsController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
