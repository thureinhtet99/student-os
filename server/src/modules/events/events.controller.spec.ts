import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';

describe('EventsController', () => {
  let service: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EventsController,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EventsController>(EventsController);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
