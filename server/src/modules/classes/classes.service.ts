import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatClass } from '../../common/formatters/class.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { ClassResponseDto } from './dto/class-response-dto.js';
import { CreateClassResponse } from './dto/create-class-response.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { QueryClassDto } from './dto/query-class-dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';

@Injectable()
export class ClassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly academicYearContext: AcademicYearContextService,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<CreateClassResponse> {
    const { name, studentIds, teachingAllocations } = createClassDto;
    const className = name.trim();

    return this.prisma.$transaction(async (tx) => {
      const academicYearId =
        createClassDto.academicYearId ??
        (await this.academicYearContext.getActiveId());

      let classItem = await tx.class.findFirst({
        where: { name: className },
      });

      if (classItem) {
        const [enrollment, teachingAllocation] = await Promise.all([
          tx.enrollment.findFirst({
            where: { classId: classItem.id, academicYearId },
          }),
          tx.teachingAllocation.findFirst({
            where: { classId: classItem.id, academicYearId },
          }),
        ]);

        if (enrollment || teachingAllocation) {
          throw new ConflictException(
            'Class with this name is already used for this academic year.',
          );
        }
      } else {
        classItem = await tx.class.create({
          data: { name: className },
        });
      }

      if (studentIds?.length) {
        const existingEnrollments = await tx.enrollment.findMany({
          where: {
            studentId: { in: studentIds },
            academicYearId: academicYearId,
          },
        });
        if (existingEnrollments.length > 0)
          throw new ConflictException(
            `One or more students are already enrolled in a class for this academic year.`,
          );

        await tx.enrollment.createMany({
          data: studentIds.map((studentId) => ({
            classId: classItem.id,
            studentId,
            academicYearId,
          })),
        });
      }

      if (teachingAllocations?.length) {
        await tx.teachingAllocation.createMany({
          data: teachingAllocations.map(({ teacherId, subjectId }) => ({
            classId: classItem.id,
            teacherId,
            subjectId,
            academicYearId,
          })),
        });
      }

      const result = await tx.class.findUnique({
        where: { id: classItem.id },
        include: {
          enrollments: {
            where: { academicYearId },
            include: { student: { include: { user: true } } },
          },
          teachingAllocations: {
            where: { academicYearId },
            include: {
              teacher: { include: { user: true } },
              subject: true,
            },
          },
        },
      });

      if (!result)
        throw new InternalServerErrorException(
          'Could not find the created class.',
        );

      const response: CreateClassResponse = {
        name: classItem.name,
        academicYearId,
      };

      if (result.enrollments) {
        response.students = result.enrollments.map((e) => ({
          id: e.student.id,
        }));
      }

      if (result.teachingAllocations) {
        response.teachingAllocations = result.teachingAllocations.map((ta) => ({
          teacher: { id: ta.teacher.id },
          subject: { id: ta.subject.id },
        }));
      }

      return response;
    });
  }

  async findAll(
    queryClassDto: QueryClassDto,
  ): Promise<PaginatedResponseDto<ClassResponseDto>> {
    const { limit = 10, page = 1, search, academicYearId } = queryClassDto;

    const effectiveAcademicYearId =
      academicYearId ?? (await this.academicYearContext.getActiveId());

    const where: Prisma.ClassWhereInput = {};
    const andConditions: Prisma.ClassWhereInput[] = [];

    if (effectiveAcademicYearId) {
      andConditions.push({
        OR: [
          {
            enrollments: {
              some: {
                academicYearId: effectiveAcademicYearId,
              },
            },
          },
          {
            teachingAllocations: {
              some: {
                academicYearId: effectiveAcademicYearId,
              },
            },
          },
        ],
      });
    }

    if (search) {
      andConditions.push({ name: { contains: search, mode: 'insensitive' } });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const total = await this.prisma.class.count({ where });

    const classItems = await this.prisma.class.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        enrollments: {
          where: { academicYearId: effectiveAcademicYearId },
          include: { student: { include: { user: true } } },
        },
        teachingAllocations: {
          where: { academicYearId: effectiveAcademicYearId },
          include: {
            teacher: { include: { user: true } },
            subject: true,
          },
        },
      },
    });

    if (academicYearId) {
      const academicYear = await this.prisma.academicYear.findUnique({
        where: { id: academicYearId },
      });
      if (!academicYear)
        throw new NotFoundException(
          'The specified academic year was not found.',
        );
    }

    const academicYear = effectiveAcademicYearId
      ? await this.prisma.academicYear.findUnique({
          where: { id: effectiveAcademicYearId },
        })
      : null;

    return {
      data: classItems.map((classItem) => formatClass(classItem, academicYear)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ClassResponseDto> {
    const effectiveAcademicYearId =
      await this.academicYearContext.getActiveId();

    const classById = await this.prisma.class.findUnique({
      where: { id },
      include: {
        enrollments: {
          where: { academicYearId: effectiveAcademicYearId },
          include: { student: { include: { user: true } } },
        },
        teachingAllocations: {
          where: { academicYearId: effectiveAcademicYearId },
          include: {
            teacher: { include: { user: true } },
            subject: true,
          },
        },
      },
    });

    if (!classById) throw new NotFoundException('Class is not found');

    const academicYear = effectiveAcademicYearId
      ? await this.prisma.academicYear.findUnique({
          where: { id: effectiveAcademicYearId },
        })
      : null;

    return formatClass(classById, academicYear);
  }

  async update(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    const { name, studentIds, teachingAllocations, academicYearId } =
      updateClassDto;

    return this.prisma.$transaction(async (tx) => {
      const classItem = await tx.class.findUnique({
        where: { id },
      });
      if (!classItem) throw new NotFoundException('Class is not found');

      if (name && classItem.name.toLowerCase() !== name.trim().toLowerCase()) {
        const duplicateClass = await tx.class.findFirst({
          where: {
            name: name.trim(),
            NOT: { id },
          },
        });

        if (duplicateClass)
          throw new ConflictException('Class with this name already exists');

        await tx.class.update({
          where: { id },
          data: { name: name.trim() },
        });
      }

      if (studentIds) {
        const existingEnrollments = await tx.enrollment.findMany({
          where: {
            classId: id,
            academicYearId: academicYearId,
          },
        });
        const existingStudentIds = existingEnrollments.map((e) => e.studentId);

        const studentIdsToUnenroll = existingStudentIds.filter(
          (sid) => !studentIds.includes(sid),
        );
        const studentIdsToEnroll = studentIds.filter(
          (sid) => !existingStudentIds.includes(sid),
        );

        if (studentIdsToUnenroll.length > 0) {
          await tx.enrollment.deleteMany({
            where: {
              classId: id,
              academicYearId: academicYearId,
              studentId: { in: studentIdsToUnenroll },
            },
          });
        }

        if (studentIdsToEnroll.length > 0) {
          const otherEnrollments = await tx.enrollment.findMany({
            where: {
              academicYearId,
              studentId: { in: studentIdsToEnroll },
            },
          });
          if (otherEnrollments.length > 0) {
            throw new ConflictException(
              'One or more students are already enrolled in another class for this academic year.',
            );
          }

          await tx.enrollment.createMany({
            data: studentIdsToEnroll.map((studentId) => ({
              classId: id,
              studentId,
              academicYearId,
            })),
          });
        }
      }

      if (teachingAllocations) {
        await tx.teachingAllocation.deleteMany({
          where: {
            classId: id,
            academicYearId: academicYearId,
          },
        });

        await tx.teachingAllocation.createMany({
          data: teachingAllocations.map((ta) => ({
            ...ta,
            classId: id,
            academicYearId,
          })),
        });
      }

      const result = await tx.class.findUnique({
        where: { id },
        include: {
          enrollments: {
            where: { academicYearId },
            include: { student: { include: { user: true } } },
          },
          teachingAllocations: {
            where: { academicYearId },
            include: {
              teacher: { include: { user: true } },
              subject: true,
            },
          },
        },
      });

      if (!result) {
        throw new InternalServerErrorException(
          'Could not find the updated class.',
        );
      }

      const academicYear = await tx.academicYear.findUnique({
        where: { id: academicYearId },
      });

      return formatClass(result, academicYear);
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingClass = await this.prisma.class.findUnique({
      where: { id },
    });
    if (!existingClass) throw new NotFoundException('Class is not found');

    await this.prisma.class.delete({ where: { id } });

    return { message: 'Class deleted successfully' };
  }
}
