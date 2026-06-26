import { NotFoundException } from '@nestjs/common';
import { ExamsService } from './exams.service';

describe('ExamsService', () => {
  let service: ExamsService;
  let prisma: any;

  const now = new Date('2026-01-01T00:00:00.000Z');
  const startTime = new Date('2026-02-01T09:00:00.000Z');
  const endTime = new Date('2026-02-01T11:00:00.000Z');
  const exam = {
    id: 'exam-1',
    name: 'Midterm',
    description: 'Term test',
    startTime,
    endTime,
    subject: { id: 'subject-1', name: 'Mathematics' },
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(() => {
    prisma = {
      exam: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new ExamsService(prisma);
  });

  it('creates an exam with normalized text and dates', async () => {
    prisma.exam.create.mockResolvedValue(exam);

    const result = await service.create({
      name: ' Midterm ',
      description: ' Term test ',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      subject_id: 'subject-1',
    });

    expect(prisma.exam.create).toHaveBeenCalledWith({
      data: {
        name: 'Midterm',
        description: 'Term test',
        startTime,
        endTime,
        subject: { connect: { id: 'subject-1' } },
      },
      include: { subject: true },
    });
    expect(result.subject).toEqual({ id: 'subject-1', name: 'Mathematics' });
  });

  it('filters and paginates exams', async () => {
    prisma.exam.count.mockResolvedValue(1);
    prisma.exam.findMany.mockResolvedValue([exam]);

    const result = await service.findAll({ search: 'mid', page: 3, limit: 2 });

    expect(prisma.exam.findMany).toHaveBeenCalledWith({
      where: { name: { contains: 'mid', mode: 'insensitive' } },
      skip: 4,
      take: 2,
      orderBy: { startTime: 'desc' },
      include: { subject: true },
    });
    expect(result.meta).toEqual({ total: 1, page: 3, limit: 2, totalPages: 1 });
  });

  it('throws when updating a missing exam', async () => {
    prisma.exam.findUnique.mockResolvedValue(null);

    await expect(service.update('missing', { name: 'Final' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.exam.update).not.toHaveBeenCalled();
  });

  it('deletes an existing exam', async () => {
    prisma.exam.findUnique.mockResolvedValue(exam);
    prisma.exam.delete.mockResolvedValue(exam);

    await expect(service.remove('exam-1')).resolves.toEqual({
      message: 'Exam deleted successfully',
    });
    expect(prisma.exam.delete).toHaveBeenCalledWith({ where: { id: 'exam-1' } });
  });
});
