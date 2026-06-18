import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatAssignment } from '../../common/formatters/assignment.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateAssignmentDto } from './dto/create-assignment.dto.js';
import { QueryAssignmentDto } from './dto/query-assignment-dto.js';
import { AssignmentResponseDto } from './dto/assignment-response.dto.js';
import { UpdateAssignmentDto } from './dto/update-assignment.dto.js';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<AssignmentResponseDto> {
    const assignment = await this.prisma.assignment.create({
      data: {
        name: createAssignmentDto.name.trim(),
        dueDate: createAssignmentDto.due_date
          ? new Date(createAssignmentDto.due_date)
          : null,
        subject: createAssignmentDto.subject_id
          ? { connect: { id: createAssignmentDto.subject_id } }
          : undefined,
      },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return formatAssignment(assignment);
  }

  async findAll(
    queryAssignmentDto: QueryAssignmentDto,
  ): Promise<PaginatedResponseDto<AssignmentResponseDto>> {
    const { search, page = 1, limit = 10 } = queryAssignmentDto;

    const where: Prisma.AssignmentWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.assignment.count({ where });

    const assignments = await this.prisma.assignment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return {
      data: assignments.map((asgn) => formatAssignment(asgn)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<AssignmentResponseDto> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    if (!assignment) throw new NotFoundException('Assignment is not found');

    return formatAssignment(assignment);
  }

  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<AssignmentResponseDto> {
    const existingAssignment = await this.prisma.assignment.findUnique({
      where: { id },
    });
    if (!existingAssignment)
      throw new NotFoundException('Assignment is not found');

    const assignment = await this.prisma.assignment.update({
      where: { id },
      data: {
        name: updateAssignmentDto.name?.trim(),
        dueDate:
          updateAssignmentDto.due_date === undefined
            ? undefined
            : updateAssignmentDto.due_date
              ? new Date(updateAssignmentDto.due_date)
              : null,
        subject:
          updateAssignmentDto.subject_id === undefined
            ? undefined
            : updateAssignmentDto.subject_id
              ? { connect: { id: updateAssignmentDto.subject_id } }
              : { disconnect: true },
      },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return formatAssignment(assignment);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingAssignment = await this.prisma.assignment.findUnique({
      where: { id },
    });
    if (!existingAssignment)
      throw new NotFoundException('Assignment is not found');

    await this.prisma.assignment.delete({ where: { id } });

    return { message: 'Assignment deleted successfully' };
  }
}
