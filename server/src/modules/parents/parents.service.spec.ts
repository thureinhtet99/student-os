import { Test, TestingModule } from '@nestjs/testing';
import { ParentsService } from './parents.service';

describe('ParentsService', () => {
  let service: ParentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ParentsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ParentsService>(ParentsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
