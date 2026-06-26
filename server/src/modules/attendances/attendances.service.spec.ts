import { NotFoundException } from '@nestjs/common';
import { AttendancesService } from './attendances.service';

describe('AttendancesService', () => {
  let service: AttendancesService;
  let prisma: any;

  const now = new Date('2026-01-01T00:00:00.000Z');
  const date = new Date('2026-04-01T00:00:00.000Z');
  const attendance = {
    id: 'attendance-1',
    present: true,
    date,
    student: { id: 'student-1', name: 'Mg Mg' },
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(() => {
    prisma = {
      attendance: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new AttendancesService(prisma);
  });

  it('creates attendance for a student', async () => {
    prisma.attendance.create.mockResolvedValue(attendance);

    const result = await service.create({
      present: true,
      date: date.toISOString(),
      student_id: 'student-1',
    });

    expect(prisma.attendance.create).toHaveBeenCalledWith({
      data: {
        present: true,
        date,
        student: { connect: { id: 'student-1' } },
      },
      include: { student: true },
    });
    expect(result.student).toEqual({ id: 'student-1', name: 'Mg Mg' });
  });

  it('filters by student and present flag', async () => {
    prisma.attendance.count.mockResolvedValue(1);
    prisma.attendance.findMany.mockResolvedValue([attendance]);

    const result = await service.findAll({
      student_id: 'student-1',
      present: false,
      page: 1,
      limit: 25,
    });

    expect(prisma.attendance.findMany).toHaveBeenCalledWith({
      where: { studentId: 'student-1', present: false },
      skip: 0,
      take: 25,
      orderBy: { date: 'desc' },
      include: { student: true },
    });
    expect(result.meta.limit).toBe(25);
  });

  it('throws when updating missing attendance', async () => {
    prisma.attendance.findUnique.mockResolvedValue(null);

    await expect(
      service.update('missing', { present: false }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes existing attendance', async () => {
    prisma.attendance.findUnique.mockResolvedValue(attendance);
    prisma.attendance.delete.mockResolvedValue(attendance);

    await expect(service.remove('attendance-1')).resolves.toEqual({
      message: 'Attendance deleted successfully',
    });
  });
});
