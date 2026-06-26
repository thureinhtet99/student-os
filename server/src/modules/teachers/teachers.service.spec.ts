import { ConflictException, NotFoundException } from '@nestjs/common';
import { hashPassword } from 'better-auth/crypto';
import { TeachersService } from './teachers.service';

jest.mock('better-auth/crypto', () => ({
  hashPassword: jest.fn(),
}));

describe('TeachersService', () => {
  let service: TeachersService;
  let prisma: any;
  let cloudinary: any;

  const now = new Date('2026-01-01T00:00:00.000Z');
  const teacher = {
    id: 'teacher-1',
    userId: 'user-1',
    teacherId: 'TCH-user-1',
    name: 'Daw Mya',
    phone: '091234567',
    address: null,
    gender: 'FEMALE',
    dateOfBirth: null,
    image: null,
    user: {
      id: 'user-1',
      email: 'mya@example.com',
      createdAt: now,
      updatedAt: now,
    },
    classes: [{ id: 'class-1', name: 'Grade 10' }],
    subjects: [{ id: 'subject-1', name: 'Mathematics' }],
  };

  beforeEach(() => {
    (hashPassword as jest.Mock).mockResolvedValue('hashed-password');
    prisma = {
      teacher: {
        findFirst: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    cloudinary = {
      uploadToCloudinary: jest.fn(),
      deleteFromCloudinary: jest.fn(),
    };
    service = new TeachersService(prisma, cloudinary);
  });

  it('creates a teacher user and profile in a transaction', async () => {
    prisma.teacher.findFirst.mockResolvedValue(null);
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        user: {
          create: jest.fn().mockResolvedValue({
            id: 'user-123456789012',
            email: 'mya@example.com',
          }),
        },
        teacher: {
          create: jest.fn().mockResolvedValue({
            ...teacher,
            userId: 'user-123456789012',
            user: {
              id: 'user-123456789012',
              email: 'mya@example.com',
              createdAt: now,
              updatedAt: now,
            },
          }),
        },
      }),
    );

    const result = await service.create({
      name: ' Daw Mya ',
      email: ' mya@example.com ',
      password: 'secret123',
      phone: null,
      address: null,
      dateOfBirth: null,
      gender: 'FEMALE',
      image: null,
    });

    expect(hashPassword).toHaveBeenCalledWith('secret123');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toMatchObject({
      name: 'Daw Mya',
      email: 'mya@example.com',
      classes: [{ id: 'class-1', name: 'Grade 10' }],
    });
  });

  it('rejects duplicate teacher names', async () => {
    prisma.teacher.findFirst.mockResolvedValue(teacher);

    await expect(
      service.create({
        name: 'Daw Mya',
        email: 'mya@example.com',
        password: 'secret123',
        phone: null,
        address: null,
        dateOfBirth: null,
        gender: 'FEMALE',
        image: null,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('finds teachers with gender and search filters', async () => {
    prisma.teacher.count.mockResolvedValue(1);
    prisma.teacher.findMany.mockResolvedValue([teacher]);

    const result = await service.findAll({
      filter: 'FEMALE',
      search: 'mya',
      page: 2,
      limit: 10,
    });

    expect(prisma.teacher.findMany).toHaveBeenCalledWith({
      where: {
        gender: 'FEMALE',
        OR: [
          { name: { contains: 'mya', mode: 'insensitive' } },
          { user: { email: { contains: 'mya', mode: 'insensitive' } } },
          { address: { contains: 'mya', mode: 'insensitive' } },
        ],
      },
      skip: 10,
      take: 10,
      orderBy: { name: 'asc' },
      include: { user: true, classes: true, subjects: true },
    });
    expect(result.data[0].email).toBe('mya@example.com');
  });

  it('throws when removing a missing teacher', async () => {
    prisma.teacher.findUnique.mockResolvedValue(null);

    await expect(service.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deletes a teacher image before deleting the user', async () => {
    prisma.teacher.findUnique.mockResolvedValue({
      ...teacher,
      image: 'https://res.cloudinary.com/demo/image/upload/teacher.png',
    });
    cloudinary.deleteFromCloudinary.mockResolvedValue(undefined);
    prisma.user.delete.mockResolvedValue(teacher.user);

    await expect(service.remove('teacher-1')).resolves.toEqual({
      message: 'Teacher deleted successfully',
    });
    expect(cloudinary.deleteFromCloudinary).toHaveBeenCalledWith(
      'https://res.cloudinary.com/demo/image/upload/teacher.png',
    );
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-1' } });
  });
});
