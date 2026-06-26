import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';

describe('StudentsController', () => {
  let service: StudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StudentsController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StudentsController>(StudentsController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
