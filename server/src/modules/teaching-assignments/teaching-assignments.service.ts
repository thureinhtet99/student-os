import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import type { TeachingAssignmentModel } from '../../../prisma/generated/prisma/models/TeachingAssignment.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto.js';
import { QueryTeachingAssignmentDto } from './dto/query-teaching-assignment.dto.js';
import { TeachingAssignmentResponseDto } from './dto/teaching-assignment-response.dto.js';
import { UpdateTeachingAssignmentDto } from './dto/update-teaching-assignment.dto.js';

@Injectable()
export class TeachingAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTeachingAssignmentDto: CreateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponseDto> {
    return this.prisma.teachingAssignment.create({
      data: {
        teacher: { connect: { id: createTeachingAssignmentDto.teacherId } },
        subject: { connect: { id: createTeachingAssignmentDto.subjectId } },
        class: { connect: { id: createTeachingAssignmentDto.classId } },
        academicYear: {
          connect: { id: createTeachingAssignmentDto.academicYearId },
        },
      },
    }) as Promise<TeachingAssignmentModel>;
  }

  async findAll(
    queryTeachingAssignmentDto: QueryTeachingAssignmentDto,
  ): Promise<PaginatedResponseDto<TeachingAssignmentResponseDto>> {
    const {
      teacherId,
      subjectId,
      classId,
      academicYearId,
      page = 1,
      limit = 10,
    } = queryTeachingAssignmentDto;
    const where: Prisma.TeachingAssignmentWhereInput = {};

    if (teacherId) where.teacherId = teacherId;
    if (subjectId) where.subjectId = subjectId;
    if (classId) where.classId = classId;
    if (academicYearId) where.academicYearId = academicYearId;

    const total = await this.prisma.teachingAssignment.count({ where });
    const teachingAssignments = await this.prisma.teachingAssignment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
    });

    return {
      data: teachingAssignments as TeachingAssignmentModel[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<TeachingAssignmentResponseDto> {
    const teachingAssignment = await this.prisma.teachingAssignment.findUnique({
      where: { id },
    });
    if (!teachingAssignment)
      throw new NotFoundException('Teaching assignment is not found');
    return teachingAssignment as TeachingAssignmentModel;
  }

  async update(
    id: string,
    updateTeachingAssignmentDto: UpdateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponseDto> {
    const existingTeachingAssignment =
      await this.prisma.teachingAssignment.findUnique({ where: { id } });
    if (!existingTeachingAssignment)
      throw new NotFoundException('Teaching assignment is not found');

    return (await this.prisma.teachingAssignment.update({
      where: { id },
      data: {
        teacher: updateTeachingAssignmentDto.teacherId
          ? { connect: { id: updateTeachingAssignmentDto.teacherId } }
          : undefined,
        subject: updateTeachingAssignmentDto.subjectId
          ? { connect: { id: updateTeachingAssignmentDto.subjectId } }
          : undefined,
        class: updateTeachingAssignmentDto.classId
          ? { connect: { id: updateTeachingAssignmentDto.classId } }
          : undefined,
        academicYear: updateTeachingAssignmentDto.academicYearId
          ? { connect: { id: updateTeachingAssignmentDto.academicYearId } }
          : undefined,
      },
    })) as TeachingAssignmentModel;
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingTeachingAssignment =
      await this.prisma.teachingAssignment.findUnique({ where: { id } });
    if (!existingTeachingAssignment)
      throw new NotFoundException('Teaching assignment is not found');

    await this.prisma.teachingAssignment.delete({ where: { id } });
    return { message: 'Teaching assignment deleted successfully' };
  }
}
