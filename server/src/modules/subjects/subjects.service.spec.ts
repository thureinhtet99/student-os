import { ConflictException, NotFoundException } from '@nestjs/common';
import { SubjectsService } from './subjects.service';

describe('SubjectsService', () => {
  let service: SubjectsService;
  let prisma: any;

  const now = new Date('2026-01-01T00:00:00.000Z');
  const subject = {
    id: 'subject-1',
    name: 'Mathematics',
    description: 'Numbers',
    class: { id: 'class-1', name: 'Grade 10' },
    teachers: [{ id: 'teacher-1', name: 'Daw Mya' }],
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(() => {
    prisma = {
      subject: {
        findFirst: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new SubjectsService(prisma);
  });

  it('creates a trimmed subject when the name is unique', async () => {
    prisma.subject.findFirst.mockResolvedValue(null);
    prisma.subject.create.mockResolvedValue(subject);

    const result = await service.create({
      name: ' Mathematics ',
      description: ' Numbers ',
      classId: 'class-1',
    });

    expect(prisma.subject.findFirst).toHaveBeenCalledWith({
      where: {
        name: { equals: 'Mathematics', mode: 'insensitive' },
      },
    });
    expect(prisma.subject.create).toHaveBeenCalledWith({
      data: {
        name: 'Mathematics',
        description: 'Numbers',
        classId: 'class-1',
      },
      include: { class: true, teachers: true },
    });
    expect(result).toMatchObject({
      id: subject.id,
      name: subject.name,
      class: { id: 'class-1', name: 'Grade 10' },
      teachers: [{ id: 'teacher-1', name: 'Daw Mya' }],
    });
  });

  it('rejects duplicate subject names', async () => {
    prisma.subject.findFirst.mockResolvedValue(subject);

    await expect(
      service.create({ name: 'Mathematics', description: null, classId: null }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.subject.create).not.toHaveBeenCalled();
  });

  it('finds subjects with search and pagination', async () => {
    prisma.subject.count.mockResolvedValue(11);
    prisma.subject.findMany.mockResolvedValue([subject]);

    const result = await service.findAll({ search: 'math', page: 2, limit: 5 });

    expect(prisma.subject.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: 'math', mode: 'insensitive' } },
          { description: { contains: 'math', mode: 'insensitive' } },
        ],
      },
      skip: 5,
      take: 5,
      orderBy: { name: 'asc' },
      include: { class: true, teachers: true },
    });
    expect(result.meta).toEqual({ total: 11, page: 2, limit: 5, totalPages: 3 });
  });

  it('throws when a subject is not found', async () => {
    prisma.subject.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('disconnects the class when classId is null during update', async () => {
    prisma.subject.findUnique.mockResolvedValue(subject);
    prisma.subject.update.mockResolvedValue({ ...subject, class: null });

    await service.update('subject-1', { classId: null });

    expect(prisma.subject.update).toHaveBeenCalledWith({
      where: { id: 'subject-1' },
      data: {
        name: undefined,
        description: undefined,
        class: { disconnect: true },
      },
      include: { class: true, teachers: true },
    });
  });
});
