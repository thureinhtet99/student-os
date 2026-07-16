import { Test, TestingModule } from '@nestjs/testing';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { TeachersService } from './teachers.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { QueryTeacherDto } from './dto/query-teacher-dto.js';
import { UserGender, UserRole } from '../../../prisma/generated/prisma/client.js';
import { NotFoundException } from '@nestjs/common';

describe('TeachersService', () => {
  let service: TeachersService;
  let prisma: PrismaService;
  let cloudinary: CloudinaryService;
  let academicYearContext: AcademicYearContextService;

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
      deleteMany: jest.fn(),
    },
    account: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation(async (callback) => {
      return await callback(mockPrisma);
    }),
  };

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
    prisma = module.get<PrismaService>(PrismaService);
    cloudinary = module.get<CloudinaryService>(CloudinaryService);
    academicYearContext = module.get<AcademicYearContextService>(
      AcademicYearContextService,
    );
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

      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.teacher.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
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

      expect(prisma.teacher.update).toHaveBeenCalled();
      expect(result.name).toBe(updateDto.name);
    });
  });

  describe('remove', () => {
    it('should remove a teacher', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);

      const result = await service.remove('teacher-1');

      expect(prisma.teachingAllocation.deleteMany).toHaveBeenCalled();
      expect(prisma.account.deleteMany).toHaveBeenCalled();
      expect(prisma.user.delete).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Teacher deleted successfully' });
    });

    it('should call cloudinary to delete image if it exists', async () => {
      mockPrisma.teacher.findUnique.mockResolvedValue(teacherPayload);
      await service.remove('teacher-1');
      expect(cloudinary.deleteFromCloudinary).toHaveBeenCalledWith(
        teacherPayload.user.image,
      );
    });
  });
});
