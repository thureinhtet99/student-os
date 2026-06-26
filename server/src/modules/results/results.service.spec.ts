import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResultsService } from './results.service';

describe('ResultsService', () => {
  let service: ResultsService;
  let prisma: any;

  const now = new Date('2026-01-01T00:00:00.000Z');
  const resultRecord = {
    id: 'result-1',
    score: 92,
    comment: 'Good work',
    exam: { id: 'exam-1', name: 'Midterm' },
    assignment: { id: 'assignment-1', name: 'Essay' },
    student: { id: 'student-1', name: 'Mg Mg' },
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(() => {
    prisma = {
      result: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new ResultsService(prisma);
  });

  it('requires an exam id when creating a result', async () => {
    await expect(
      service.create({
        score: 90,
        comment: null,
        exam_id: ' ',
        assignment_id: 'assignment-1',
        student_id: 'student-1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a result with trimmed relation ids and comment', async () => {
    prisma.result.create.mockResolvedValue(resultRecord);

    const result = await service.create({
      score: 92,
      comment: ' Good work ',
      exam_id: ' exam-1 ',
      assignment_id: ' assignment-1 ',
      student_id: 'student-1',
    });

    expect(prisma.result.create).toHaveBeenCalledWith({
      data: {
        score: 92,
        comment: 'Good work',
        exam: { connect: { id: 'exam-1' } },
        assignment: { connect: { id: 'assignment-1' } },
        student: { connect: { id: 'student-1' } },
      },
      include: { exam: true, assignment: true, student: true },
    });
    expect(result.exam).toEqual(resultRecord.exam);
  });

  it('filters results by student', async () => {
    prisma.result.count.mockResolvedValue(1);
    prisma.result.findMany.mockResolvedValue([resultRecord]);

    const result = await service.findAll({
      student_id: 'student-1',
      page: 2,
      limit: 5,
    });

    expect(prisma.result.findMany).toHaveBeenCalledWith({
      where: { studentId: 'student-1' },
      skip: 5,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { exam: true, assignment: true, student: true },
    });
    expect(result.meta.totalPages).toBe(1);
  });

  it('throws when a result is not found', async () => {
    prisma.result.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
