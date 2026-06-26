import { Test, TestingModule } from '@nestjs/testing';
import { ExamsController } from './exams.controller';

describe('ExamsController', () => {
  let service: ExamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ExamsController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExamsController>(ExamsController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
