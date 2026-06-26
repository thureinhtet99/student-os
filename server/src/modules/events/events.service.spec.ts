import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: any;

  const now = new Date('2026-01-01T00:00:00.000Z');
  const startTime = new Date('2026-03-01T09:00:00.000Z');
  const endTime = new Date('2026-03-01T10:00:00.000Z');
  const event = {
    id: 'event-1',
    name: 'Assembly',
    description: 'School event',
    startTime,
    endTime,
    class: { id: 'class-1', name: 'Grade 10' },
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(() => {
    prisma = {
      event: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new EventsService(prisma);
  });

  it('creates an event with optional classId', async () => {
    prisma.event.create.mockResolvedValue(event);

    await service.create({
      name: ' Assembly ',
      description: '',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      classId: 'class-1',
    });

    expect(prisma.event.create).toHaveBeenCalledWith({
      data: {
        name: 'Assembly',
        description: null,
        startTime,
        endTime,
        classId: 'class-1',
      },
      include: { class: true },
    });
  });

  it('filters events by class and search', async () => {
    prisma.event.count.mockResolvedValue(1);
    prisma.event.findMany.mockResolvedValue([event]);

    const result = await service.findAll({
      search: 'assembly',
      classId: 'class-1',
      page: 2,
      limit: 10,
    });

    expect(prisma.event.findMany).toHaveBeenCalledWith({
      where: {
        classId: 'class-1',
        name: { contains: 'assembly', mode: 'insensitive' },
      },
      skip: 10,
      take: 10,
      orderBy: { startTime: 'desc' },
      include: { class: true },
    });
    expect(result.data[0].class).toEqual({ id: 'class-1', name: 'Grade 10' });
  });

  it('throws when an event is not found', async () => {
    prisma.event.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('disconnects class during update when classId is null', async () => {
    prisma.event.findUnique.mockResolvedValue(event);
    prisma.event.update.mockResolvedValue({ ...event, class: null });

    await service.update('event-1', { classId: null });

    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: 'event-1' },
      data: {
        name: undefined,
        description: undefined,
        startTime: undefined,
        endTime: undefined,
        class: { disconnect: true },
      },
      include: { class: true },
    });
  });
});
