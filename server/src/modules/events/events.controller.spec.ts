import { EventsController } from './events.controller';

describe('EventsController', () => {
  let controller: EventsController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new EventsController(service);
  });

  it('delegates create to the events service', async () => {
    const dto = {
      name: 'Assembly',
      description: null,
      startTime: '2026-01-01T09:00:00.000Z',
      endTime: '2026-01-01T10:00:00.000Z',
      classId: null,
    };
    const response = { id: 'event-1' };
    service.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('delegates list and item operations', async () => {
    const query = { classId: 'class-1', page: 1, limit: 10 };
    service.findAll.mockResolvedValue({ data: [], meta: {} });
    service.findOne.mockResolvedValue({ id: 'event-1' });
    service.update.mockResolvedValue({ id: 'event-1' });
    service.remove.mockResolvedValue({ message: 'Event deleted successfully' });

    await controller.findAll(query);
    await controller.findOne('event-1');
    await controller.update('event-1', { name: 'Sports Day' });
    await controller.remove('event-1');

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findOne).toHaveBeenCalledWith('event-1');
    expect(service.update).toHaveBeenCalledWith('event-1', {
      name: 'Sports Day',
    });
    expect(service.remove).toHaveBeenCalledWith('event-1');
  });
});
