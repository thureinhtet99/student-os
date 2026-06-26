import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from './classes.controller';

describe('ClassesController', () => {
  let service: ClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ClassesController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ClassesController>(ClassesController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
