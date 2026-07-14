import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'node:crypto';
import {
  ParentRelationship,
  Prisma,
  UserRole,
} from '../../../prisma/generated/prisma/client.js';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatStudent } from '../../common/formatters/student.formatter.js';
import { formatGender } from '../../common/formatters/user.formatter.js';
import { checkDuplicate } from '../../common/utils/db.util.js';
import { resolveImageUrl } from '../../common/utils/image.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { QueryStudentDto } from './dto/query-student-dto.js';
import { StudentResponseDto } from './dto/student-response.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly academicYearContext: AcademicYearContextService,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    const {
      email,
      password,
      name,
      phone,
      address,
      image,
      gender,
      dateOfBirth,
      classId,
      parentId,
    } = createStudentDto;

    await checkDuplicate(
      this.prisma.user,
      'name',
      createStudentDto.name,
      null,
      'Student with this name already exists',
    );

    await checkDuplicate(
      this.prisma.user,
      'email',
      createStudentDto.email,
      null,
      'Student with this email already exists',
    );

    if (createStudentDto.phone) {
      await checkDuplicate(
        this.prisma.student,
        'phone',
        createStudentDto.phone,
        null,
        'Student with this phone number already exists',
      );
    }

    const imageUrl = resolveImageUrl(image, this.cloudinary);
    const hashedPwd = await hashPassword(password);
    const userId = randomUUID();

    const student = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          id: userId,
          email: email.trim(),
          name: name.trim(),
          role: UserRole.STUDENT,
          image: imageUrl,
          accounts: {
            create: {
              id: randomUUID(),
              accountId: userId,
              providerId: 'credential',
              password: hashedPwd,
            },
          },
        },
      });

      const studentId = `STU-${createdUser.id.slice(-12)}`;

      const academicYearId =
        createStudentDto.academicYearId ??
        (await this.academicYearContext.getActiveId());

      return tx.student.create({
        data: {
          studentNumber: studentId,
          userId: createdUser.id,
          phone,
          address,
          gender,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          ...(classId &&
            academicYearId && {
              enrollments: {
                create: {
                  classId,
                  academicYearId,
                },
              },
            }),
          ...(parentId && {
            parents: {
              create: {
                parentId: parentId,
                relationship: ParentRelationship.GUARDIAN,
              },
            },
          }),
        },
        include: {
          user: true,
          parents: {
            include: {
              parent: { select: { id: true } },
            },
          },
          enrollments: {
            include: {
              class: { select: { id: true } },
            },
          },
        },
      });
    });

    return formatStudent(student);
  }

  async findAll(
    queryStudentDto: QueryStudentDto,
  ): Promise<PaginatedResponseDto<StudentResponseDto>> {
    const { classId, gender, search, page = 1, limit = 10 } = queryStudentDto;

    const where: Prisma.StudentWhereInput = {};

    if (classId) {
      where.enrollments = {
        some: {
          classId,
        },
      };
    }

    if (gender) where.gender = gender;

    if (search) {
      where.OR = [
        {
          user: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
        {
          user: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
        {
          address: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.student.count({ where });

    const students = await this.prisma.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { user: { name: 'asc' } },
      include: {
        user: true,
        parents: {
          include: {
            parent: { select: { id: true } },
          },
        },
        enrollments: {
          include: {
            class: { select: { id: true } },
          },
        },
      },
    });

    return {
      data: students.map((student) => formatStudent(student)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        parents: {
          include: {
            parent: { select: { id: true } },
          },
        },
        enrollments: {
          include: {
            class: { select: { id: true } },
          },
        },
      },
    });

    if (!student) throw new NotFoundException('Student is not found');

    return formatStudent(student);
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    const existingStudent = await this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!existingStudent) throw new NotFoundException('Student is not found');

    if (
      updateStudentDto.name &&
      existingStudent.user.name.toLowerCase() !==
        updateStudentDto.name.trim().toLowerCase()
    ) {
      await checkDuplicate(
        this.prisma.user,
        'name',
        updateStudentDto.name,
        existingStudent.userId,
        'Student with this name already exists',
      );
    }

    if (
      updateStudentDto.email &&
      existingStudent.user.email !== updateStudentDto.email.trim()
    ) {
      await checkDuplicate(
        this.prisma.user,
        'email',
        updateStudentDto.email,
        existingStudent.userId,
        'Student with this email already exists',
      );
    }

    if (
      updateStudentDto.phone &&
      existingStudent.phone !== updateStudentDto.phone.trim()
    ) {
      await checkDuplicate(
        this.prisma.student,
        'phone',
        updateStudentDto.phone,
        id,
        'Student with this phone number already exists',
      );
    }

    const classId =
      updateStudentDto.classId === undefined
        ? undefined
        : updateStudentDto.classId?.trim() || null;

    const academicYearId =
      updateStudentDto.academicYearId ??
      (classId !== undefined
        ? await this.academicYearContext.getActiveId()
        : undefined);

    const student = await this.prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { id },
        data: {
          user: {
            update: {
              email: updateStudentDto.email?.trim(),
              name: updateStudentDto.name?.trim(),
              image:
                updateStudentDto.image === undefined
                  ? undefined
                  : resolveImageUrl(updateStudentDto.image, this.cloudinary),
            },
          },
          phone:
            updateStudentDto.phone === undefined
              ? undefined
              : updateStudentDto.phone?.trim() || null,
          address:
            updateStudentDto.address === undefined
              ? undefined
              : updateStudentDto.address?.trim() || null,
          dateOfBirth:
            updateStudentDto.dateOfBirth === undefined
              ? undefined
              : updateStudentDto.dateOfBirth
                ? new Date(updateStudentDto.dateOfBirth)
                : null,
          gender: updateStudentDto.gender
            ? formatGender(updateStudentDto.gender)
            : undefined,
          ...(updateStudentDto.parentId !== undefined && {
            parents: updateStudentDto.parentId
              ? {
                  deleteMany: {},
                  create: {
                    parentId: updateStudentDto.parentId,
                    relationship: 'GUARDIAN',
                  },
                }
              : {
                  deleteMany: {},
                },
          }),
        },
      });

      if (classId !== undefined && academicYearId) {
        if (classId) {
          await tx.enrollment.upsert({
            where: {
              studentId_academicYearId: {
                studentId: id,
                academicYearId,
              },
            },
            update: {
              classId,
            },
            create: {
              studentId: id,
              classId,
              academicYearId,
            },
          });
        } else {
          await tx.enrollment.deleteMany({
            where: {
              studentId: id,
              academicYearId,
            },
          });
        }
      }

      return tx.student.findUniqueOrThrow({
        where: { id },
        include: {
          user: true,
          parents: {
            include: {
              parent: { select: { id: true } },
            },
          },
          enrollments: {
            include: {
              class: { select: { id: true } },
            },
          },
        },
      });
    });

    return formatStudent(student);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingStudent = await this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!existingStudent) throw new NotFoundException('Student is not found');

    if (existingStudent.user.image) {
      try {
        await this.cloudinary.deleteFromCloudinary(existingStudent.user.image);
      } catch (error) {
        this.logger.warn(
          `Failed to delete image from Cloudinary for student ${id}: ${(error as Error).message}`,
        );
      }
    }

    await this.prisma.$transaction([
      this.prisma.parentStudent.deleteMany({
        where: { studentId: id },
      }),
      this.prisma.enrollment.deleteMany({
        where: { studentId: id },
      }),
      this.prisma.account.deleteMany({
        where: { userId: existingStudent.userId },
      }),
      this.prisma.user.delete({ where: { id: existingStudent.userId } }),
    ]);

    return { message: 'Student deleted successfully' };
  }
}
