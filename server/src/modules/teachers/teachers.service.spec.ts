import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, UserGender } from '../../../prisma/generated/prisma/client.js';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { QueryTeacherDto } from './dto/query-teacher-dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { TeachersService } from './teachers.service.js';

describe('TeachersService', () => {
  let service: TeachersService;

  const mockPrisma = {
    teacher: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
    teachingAllocation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    account: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  type TransactionCallback<T> = (tx: typeof mockPrisma) => Promise<T>;
  type TransactionInput<T> = TransactionCallback<T> | Prisma.PrismaPromise<T>[];

  const isTransactionCallback = <T>(
    input: TransactionInput<T>,
  ): input is TransactionCallback<T> => typeof input === 'function';

  const mockCloudinary = {
    deleteFromCloudinary: jest.fn(),
    getCloudinaryUrl: jest.fn(),
    resolveImageUrl: jest.fn(),
  };

  const mockAcademicYearContext = {
    getActiveId: jest.fn(),
  };

  const teacherPayload = {
    id: 'teacher-1',
    userId: 'user-1',
    employeeCode: 'TCH-1',
    phone: '123',
    address: 'address',
    gender: UserGender.MALE,
    dateOfBirth: new Date(),
    user: {
      id: 'user-1',
      name: 'Test Teacher',
      email: 'teacher@test.com',
      image: 'image-url',
    },
    teachingAllocations: [],
  };

  beforeEach(async () => {
    mockPrisma.$transaction.mockImplementation(
      async <T>(input: TransactionInput<T>): Promise<T | T[]> => {
        if (isTransactionCallback(input)) {
          return input(mockPrisma);
        }

        return Promise.all(input);
      },
    );
    mockAcademicYearContext.getActiveId.mockResolvedValue('ay-current');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CloudinaryService, useValue: mockCloudinary },
        {
          provide: AcademicYearContextService,
          useValue: mockAcademicYearContext,
        },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new teacher', async () => {
      const createDto: CreateTeacherDto = {
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password',
        gender: UserGender.MALE,
      };

      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.teacher.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(teacherPayload.user);
      mockPrisma.teacher.create.mockResolvedValue(teacherPayload);

      const result = await service.create(createDto);

      expect(mockPrisma.user.create.mock.calls.length).toBeGreaterThan(0);
      expect(mockPrisma.teacher.create.mock.calls.length).toBeGreaterThan(0);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
    });

    it('should use current academic year when creating allocation without academicYearId', async () => {
      const createDto: CreateTeacherDto = {
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password',
        gender: UserGender.MALE,
        classId: 'class-1',
        subjectId: 'subject-1',
      };

      const teacherWithAllocation = {
        ...teacherPayload,
        teachingAllocations: [
          {
            id: 'alloc-1',
            teacherId: teacherPayload.id,
            classId: 'class-1',
            subjectId: 'subject-1',
            academicYearId: 'ay-current',
            class: { name: 'Class A' },
            subject: { name: 'Math' },
          },
        ],
      };

      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.teacher.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(teacherPayload.user);
      mockPrisma.teacher.create.mockResolvedValue(teacherWithAllocation);

      const result = await service.create(createDto);
      const [teacherCreateCall] = (mockPrisma.teacher.create.mock.calls.at(0) ??
        []) as [
        {
          data?: {
            teachingAllocations?: {
              create?: {
                classId?: string | null;
                subjectId?: string | null;
                academicYearId?: string | null;
              };
            };
          };
        }?,
      ];

      expect(mockAcademicYearContext.getActiveId.mock.calls.length).toBe(1);
      expect(
        teacherCreateCall?.data?.teachingAllocations?.create?.classId,
      ).toBe(createDto.classId);
      expect(
        teacherCreateCall?.data?.teachingAllocations?.create?.subjectId,
      ).toBe(createDto.subjectId);
      expect(
        teacherCreateCall?.data?.teachingAllocations?.create?.academicYearId,
      ).toBe('ay-current');
      expect(result.academicYearId).toBe('ay-current');
    });

    it('should fail when allocation is requested but no current academic year exists', async () => {
      const createDto: CreateTeacherDto = {
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password',
        gender: UserGender.MALE,
        classId: 'class-1',
        subjectId: 'subject-1',
      };

      mockAcademicYearContext.getActiveId.mockRejectedValueOnce(
        new NotFoundException('No active academic year found'),
      );
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.teacher.findFirst.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        'No active academic year found',
      );
      expect(mockPrisma.teacher.create.mock.calls.length).toBe(0);
    });

    it('should prefer explicit academicYearId over request context when creating allocation', async () => {
      const createDto: CreateTeacherDto = {
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password',
        gender: UserGender.MALE,
        classId: 'class-1',
        subjectId: 'subject-1',
        academicYearId: 'ay-explicit',
      };

      const teacherWithAllocation = {
        ...teacherPayload,
        teachingAllocations: [
          {
            id: 'alloc-1',
            teacherId: teacherPayload.id,
            classId: 'class-1',
            subjectId: 'subject-1',
            academicYearId: 'ay-explicit',
            class: { name: 'Class A' },
            subject: { name: 'Math' },
          },
        ],
      };

      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.teacher.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(teacherPayload.user);
      mockPrisma.teacher.create.mockResolvedValue(teacherWithAllocation);

      const result = await service.create(createDto);
      const [teacherCreateCall] = (mockPrisma.teacher.create.mock.calls.at(0) ??
        []) as [
        {
          data?: {
            teachingAllocations?: {
              create?: {
                academicYearId?: string | null;
              };
            };
          };
        }?,
      ];

      expect(mockAcademicYearContext.getActiveId.mock.calls.length).toBe(0);
      expect(
        teacherCreateCall?.data?.teachingAllocations?.create?.academicYearId,
      ).toBe('ay-explicit');
      expect(result.academicYearId).toBe('ay-explicit');
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of teachers', async () => {
      const query: QueryTeacherDto = { page: 1, limit: 10 };
      mockPrisma.teacher.findMany.mockResolvedValue([teacherPayload]);
      mockPrisma.teacher.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data.length).toBe(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a single teacher', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      const result = await service.findOne('teacher-1');
      expect(result).toBeDefined();
      expect(result.id).toBe(teacherPayload.id);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a teacher', async () => {
      const updateDto: UpdateTeacherDto = { name: 'Updated Name' };

      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      mockPrisma.teacher.findUniqueOrThrow.mockResolvedValue({
        ...teacherPayload,
        user: { ...teacherPayload.user, name: updateDto.name },
      });

      const result = await service.update('teacher-1', updateDto);

      expect(mockPrisma.teacher.update.mock.calls.length).toBeGreaterThan(0);
      expect(result.name).toBe(updateDto.name);
    });

    it('should create teaching allocation using current academic year when missing in payload', async () => {
      const updateDto: UpdateTeacherDto = {
        classId: 'class-1',
        subjectId: 'subject-1',
      };

      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      mockPrisma.teachingAllocation.findFirst.mockResolvedValue(null);
      mockPrisma.teacher.findUniqueOrThrow.mockResolvedValue({
        ...teacherPayload,
        teachingAllocations: [
          {
            id: 'alloc-1',
            teacherId: teacherPayload.id,
            classId: 'class-1',
            subjectId: 'subject-1',
            academicYearId: 'ay-current',
            class: { name: 'Class A' },
            subject: { name: 'Math' },
          },
        ],
      });

      const result = await service.update('teacher-1', updateDto);

      expect(mockAcademicYearContext.getActiveId.mock.calls.length).toBe(1);
      expect(mockPrisma.teachingAllocation.create.mock.calls).toContainEqual([
        {
          data: {
            teacherId: 'teacher-1',
            classId: 'class-1',
            subjectId: 'subject-1',
            academicYearId: 'ay-current',
          },
        },
      ]);
      expect(result.academicYearId).toBe('ay-current');
    });

    it('should fail update when allocation changes require current academic year but none exists', async () => {
      const updateDto: UpdateTeacherDto = {
        classId: 'class-1',
        subjectId: 'subject-1',
      };

      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      mockAcademicYearContext.getActiveId.mockRejectedValueOnce(
        new NotFoundException('No active academic year found'),
      );

      await expect(service.update('teacher-1', updateDto)).rejects.toThrow(
        'No active academic year found',
      );
      expect(mockPrisma.teacher.update.mock.calls.length).toBe(0);
    });

    it('should update existing allocation with explicit academicYearId without using context year', async () => {
      const updateDto: UpdateTeacherDto = {
        subjectId: 'subject-2',
        academicYearId: 'ay-explicit',
      };

      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      mockPrisma.teachingAllocation.findFirst.mockResolvedValue({
        id: 'alloc-1',
        teacherId: 'teacher-1',
        classId: 'class-1',
        subjectId: 'subject-1',
        academicYearId: 'ay-explicit',
      });
      mockPrisma.teacher.findUniqueOrThrow.mockResolvedValue({
        ...teacherPayload,
        teachingAllocations: [
          {
            id: 'alloc-1',
            teacherId: teacherPayload.id,
            classId: 'class-1',
            subjectId: 'subject-2',
            academicYearId: 'ay-explicit',
            class: { name: 'Class A' },
            subject: { name: 'Science' },
          },
        ],
      });

      const result = await service.update('teacher-1', updateDto);

      expect(mockAcademicYearContext.getActiveId.mock.calls.length).toBe(0);
      expect(mockPrisma.teachingAllocation.findFirst.mock.calls).toContainEqual(
        [
          {
            where: { teacherId: 'teacher-1', academicYearId: 'ay-explicit' },
          },
        ],
      );
      expect(mockPrisma.teachingAllocation.update.mock.calls).toContainEqual([
        {
          where: { id: 'alloc-1' },
          data: {
            classId: 'class-1',
            subjectId: 'subject-2',
          },
        },
      ]);
      expect(result.academicYearId).toBe('ay-explicit');
    });

    it('should clear allocation when classId is explicitly null for the target academic year', async () => {
      const updateDto: UpdateTeacherDto = {
        classId: null,
        academicYearId: 'ay-explicit',
      };

      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      mockPrisma.teachingAllocation.findFirst.mockResolvedValue({
        id: 'alloc-1',
        teacherId: 'teacher-1',
        classId: 'class-1',
        subjectId: 'subject-1',
        academicYearId: 'ay-explicit',
      });
      mockPrisma.teacher.findUniqueOrThrow.mockResolvedValue({
        ...teacherPayload,
        teachingAllocations: [],
      });

      const result = await service.update('teacher-1', updateDto);

      expect(
        mockPrisma.teachingAllocation.deleteMany.mock.calls,
      ).toContainEqual([
        {
          where: { teacherId: 'teacher-1', academicYearId: 'ay-explicit' },
        },
      ]);
      expect(mockPrisma.teachingAllocation.update.mock.calls.length).toBe(0);
      expect(mockPrisma.teachingAllocation.create.mock.calls.length).toBe(0);
      expect(result.academicYearId).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a teacher', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);

      const result = await service.remove('teacher-1');

      expect(mockPrisma.teachingAllocation.deleteMany.mock.calls.length).toBe(
        1,
      );
      expect(mockPrisma.account.deleteMany.mock.calls.length).toBe(1);
      expect(mockPrisma.user.delete.mock.calls.length).toBe(1);
      expect(result).toEqual({ message: 'Teacher deleted successfully' });
    });

    it('should call cloudinary to delete image if it exists', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      await service.remove('teacher-1');
      expect(mockCloudinary.deleteFromCloudinary.mock.calls[0]).toEqual([
        teacherPayload.user.image,
      ]);
    });
  });
});
