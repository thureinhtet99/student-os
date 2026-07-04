import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto.js';
import { QueryEnrollmentDto } from './dto/query-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    return this.prisma.enrollment.create({
      data: {
        student: { connect: { id: createEnrollmentDto.studentId } },
        class: { connect: { id: createEnrollmentDto.classId } },
        academicYear: { connect: { id: createEnrollmentDto.academicYearId } },
      },
    });
  }

  async findAll(
    queryEnrollmentDto: QueryEnrollmentDto,
  ): Promise<PaginatedResponseDto<EnrollmentResponseDto>> {
    const {
      studentId,
      classId,
      academicYearId,
      page = 1,
      limit = 10,
    } = queryEnrollmentDto;

    const where: Prisma.EnrollmentWhereInput = {};
    if (studentId) where.studentId = studentId;
    if (classId) where.classId = classId;
    if (academicYearId) where.academicYearId = academicYearId;

    const total = await this.prisma.enrollment.count({ where });
    const enrollments = await this.prisma.enrollment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: enrollments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<EnrollmentResponseDto> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!enrollment) throw new NotFoundException('Enrollment is not found');
    return enrollment;
  }

  async update(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!existingEnrollment)
      throw new NotFoundException('Enrollment is not found');

    return await this.prisma.enrollment.update({
      where: { id },
      data: {
        student: updateEnrollmentDto.studentId
          ? { connect: { id: updateEnrollmentDto.studentId } }
          : undefined,
        class: updateEnrollmentDto.classId
          ? { connect: { id: updateEnrollmentDto.classId } }
          : undefined,
        academicYear: updateEnrollmentDto.academicYearId
          ? { connect: { id: updateEnrollmentDto.academicYearId } }
          : undefined,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!existingEnrollment)
      throw new NotFoundException('Enrollment is not found');

    await this.prisma.enrollment.delete({ where: { id } });
    return { message: 'Enrollment deleted successfully' };
  }
}
