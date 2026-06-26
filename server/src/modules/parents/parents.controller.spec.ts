import { Test, TestingModule } from '@nestjs/testing';
import { ParentsController } from './parents.controller';

describe('ParentsController', () => {
  let service: ParentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ParentsController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ParentsController>(ParentsController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
