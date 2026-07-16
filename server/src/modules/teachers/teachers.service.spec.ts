import { Test, TestingModule } from '@nestjs/testing';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { TeachersService } from './teachers.service.js';

describe('TeachersService', () => {
  let service: TeachersService;
  let prisma: PrismaService;
  let academicYearContext: AcademicYearContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: PrismaService,
          useValue: {
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
              upsert: jest.fn(),
              deleteMany: jest.fn(),
            },
            account: {
              deleteMany: jest.fn(),
            },
            $transaction: jest.fn().mockImplementation((arg: unknown) => {
              if (typeof arg === 'function') {
                return arg(prisma);
              }
              return (arg as unknown[]).map((op) => op);
            }),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            deleteFromCloudinary: jest.fn(),
            getCloudinaryUrl: jest.fn(),
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

    service = module.get<TeachersService>(TeachersService);
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

  it('falls back to active academic year when createTeacherDto.academicYearId is omitted', async () => {
    const dto = {
      name: 'No Year',
      email: 'noyear@teacher.com',
      password: 'password123',
      gender: 'MALE' as const,
      classId: 'class-1',
      subjectId: 'subject-1',
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.teacher.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: dto.name,
      email: dto.email,
    });
    (prisma.teacher.create as jest.Mock).mockResolvedValue({
      id: 'teacher-1',
      userId: 'user-1',
      employeeCode: 'TCH-1',
      user: { id: 'user-1' },
      teachingAllocations: [],
    });
    (academicYearContext.getActiveId as jest.Mock).mockResolvedValue(
      'active-year-id',
    );

    await service.create(dto);

    expect(academicYearContext.getActiveId).toHaveBeenCalled();
    expect(prisma.teacher.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          teachingAllocations: {
            create: {
              classId: 'class-1',
              subjectId: 'subject-1',
              academicYearId: 'active-year-id',
            },
          },
        }),
      }),
    );
  });
});
