import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesController } from './attendances.controller';

describe('AttendancesController', () => {
  let service: AttendancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AttendancesController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AttendancesController>(AttendancesController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
