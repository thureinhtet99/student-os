import { Test, TestingModule } from '@nestjs/testing';
import { UserGender, UserRole } from '../../../prisma/generated/prisma/client';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import * as studentFormatter from '../../common/formatters/student.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { StudentResponseDto } from './dto/student-response.dto.js';
import { StudentsService } from './students.service';

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: PrismaService;
  let academicYearContext: AcademicYearContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: PrismaService,
          useValue: {
            student: {
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
            enrollment: {
              upsert: jest.fn(),
              deleteMany: jest.fn(),
            },
            $transaction: jest
              .fn()
              .mockImplementation((callback: (tx: PrismaService) => any) =>
                callback(prisma),
              ),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            deleteFromCloudinary: jest.fn(),
            resolveImageUrl: jest.fn(),
          },
        },
        {
          provide: AcademicYearContextService,
          useValue: {
            getActiveId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prisma = module.get<PrismaService>(PrismaService);
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
    it('should create a student and use active academic year if not provided', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'Test Student',
        email: 'test@student.com',
        password: 'password123',
        gender: 'MALE',
      };

      const mockUser = {
        id: 'user-1',
        name: 'Test Student',
        email: 'test@student.com',
        role: UserRole.STUDENT,
        image: null,
      };
      const mockStudent = {
        id: 'student-1',
        userId: 'user-1',
        studentNumber: 'STU-123',
        phone: null,
        address: null,
        gender: UserGender.MALE,
        dateOfBirth: new Date(),
        parents: [],
        enrollments: [],
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.student.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.student.create as jest.Mock).mockResolvedValue(mockStudent);
      (academicYearContext.getActiveId as jest.Mock).mockResolvedValue(
        'active-year-id',
      );

      const expectedResult: Partial<StudentResponseDto> = {
        id: 'user-1',
        name: 'Test Student',
      };
      const formatStudentSpy = jest
        .spyOn(studentFormatter, 'formatStudent')
        .mockReturnValue(expectedResult as StudentResponseDto);

      const result = await service.create(createStudentDto);

      expect(academicYearContext.getActiveId).toHaveBeenCalled();
      expect(prisma.student.create).toHaveBeenCalled();
      expect(formatStudentSpy).toHaveBeenCalledWith(mockStudent);
      expect(result).toEqual(expectedResult);
    });

    it('should use provided academic year id', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'Test Student 2',
        email: 'test2@student.com',
        password: 'password123',
        academicYearId: 'provided-year-id',
        classId: 'class-1',
        gender: 'MALE',
      };

      const mockUser = {
        id: 'user-2',
        name: 'Test Student 2',
        email: 'test2@student.com',
        role: UserRole.STUDENT,
        image: null,
      };
      const mockStudent = {
        id: 'student-2',
        userId: 'user-2',
        studentNumber: 'STU-456',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.student.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.student.create as jest.Mock).mockResolvedValue(mockStudent);

      const expectedResult: Partial<StudentResponseDto> = {
        id: 'user-2',
        name: 'Test Student 2',
      };
      jest
        .spyOn(studentFormatter, 'formatStudent')
        .mockReturnValue(expectedResult as StudentResponseDto);

      await service.create(createStudentDto);

      expect(academicYearContext.getActiveId).not.toHaveBeenCalled();
      expect(prisma.student.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            enrollments: {
              create: {
                classId: 'class-1',
                academicYearId: 'provided-year-id',
              },
            },
          }),
        }),
      );
    });
  });

  describe('update', () => {
    it('updates a student without resolving active academic year when class is unchanged', async () => {
      const existingStudent = {
        id: 'student-1',
        userId: 'user-1',
        user: { id: 'user-1', name: 'Old Name', email: 'old@student.com' },
      };
      const updatedStudent = {
        ...existingStudent,
        user: { ...existingStudent.user, name: 'New Name' },
      };

      (prisma.student.findUnique as jest.Mock).mockResolvedValue(
        existingStudent,
      );
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.student.update as jest.Mock).mockResolvedValue(updatedStudent);
      (prisma.student.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        updatedStudent,
      );
      jest
        .spyOn(studentFormatter, 'formatStudent')
        .mockReturnValue(updatedStudent as any);

      const result = await service.update('student-1', {
        name: 'New Name',
      } as any);

      expect(result).toEqual(updatedStudent);
      expect(academicYearContext.getActiveId).not.toHaveBeenCalled();
      expect(prisma.student.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'student-1' },
          data: expect.objectContaining({
            user: expect.any(Object),
          }),
        }),
      );
    });

    it('fetches active academic year when updating class enrollment without academicYearId', async () => {
      const existingStudent = {
        id: 'student-1',
        userId: 'user-1',
        user: { id: 'user-1', name: 'Old Name', email: 'old@student.com' },
      };
      const updatedStudent = {
        ...existingStudent,
        user: { ...existingStudent.user, name: 'New Name' },
      };

      (prisma.student.findUnique as jest.Mock).mockResolvedValue(
        existingStudent,
      );
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.student.update as jest.Mock).mockResolvedValue(updatedStudent);
      (prisma.enrollment.upsert as jest.Mock).mockResolvedValue({});
      (prisma.student.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        updatedStudent,
      );
      (academicYearContext.getActiveId as jest.Mock).mockResolvedValue(
        'active-year-id',
      );
      jest
        .spyOn(studentFormatter, 'formatStudent')
        .mockReturnValue(updatedStudent as any);

      const result = await service.update('student-1', {
        name: 'New Name',
        classId: 'class-1',
      } as any);

      expect(result).toEqual(updatedStudent);
      expect(academicYearContext.getActiveId).toHaveBeenCalled();
      expect(prisma.enrollment.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            studentId_academicYearId: {
              studentId: 'student-1',
              academicYearId: 'active-year-id',
            },
          },
          update: {
            classId: 'class-1',
          },
          create: {
            studentId: 'student-1',
            classId: 'class-1',
            academicYearId: 'active-year-id',
          },
        }),
      );
    });

    it('updates email and preserves unchanged optional fields', async () => {
      const existingStudent = {
        id: 'student-1',
        userId: 'user-1',
        user: {
          id: 'user-1',
          name: 'Old Name',
          email: 'old@student.com',
          image: 'http://example.com/old-image.png',
        },
        phone: '1234567890',
        address: '123 Old St',
        dateOfBirth: new Date('2005-01-01'),
      };
      const updatedStudent = {
        ...existingStudent,
        user: { ...existingStudent.user, email: 'new@student.com' },
      };

      (prisma.student.findUnique as jest.Mock).mockResolvedValue(
        existingStudent,
      );
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.student.update as jest.Mock).mockResolvedValue(updatedStudent);
      (prisma.student.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        updatedStudent,
      );
      jest
        .spyOn(studentFormatter, 'formatStudent')
        .mockReturnValue(updatedStudent as any);

      const result = await service.update('student-1', {
        email: 'new@student.com',
      } as any);

      expect(result).toEqual(updatedStudent);
      expect(prisma.student.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'student-1' },
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: 'new@student.com',
              image: undefined,
            }),
            address: undefined,
            dateOfBirth: undefined,
          }),
        }),
      );
    });
  });
});
