import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateTeachingAllocationDto } from './dto/create-teaching-allocation.dto.js';
import { QueryTeachingAllocationDto } from './dto/query-teaching-allocation.dto.js';
import { TeachingAllocationResponseDto } from './dto/teaching-allocation-response.dto.js';
import { UpdateTeachingAllocationDto } from './dto/update-teaching-allocation.dto.js';

@Injectable()
export class TeachingAllocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTeachingAllocationDto: CreateTeachingAllocationDto,
  ): Promise<TeachingAllocationResponseDto> {
    const { teacherId, subjectId, classId, academicYearId } =
      createTeachingAllocationDto;

    const existing = await this.prisma.teachingAllocation.findFirst({
      where: {
        teacherId,
        subjectId,
        classId,
        academicYearId,
      },
    });

    if (existing) {
      throw new ConflictException('This teaching assignment already exists');
    }

    return this.prisma.teachingAllocation.create({
      data: {
        teacher: { connect: { id: teacherId } },
        subject: { connect: { id: subjectId } },
        class: { connect: { id: classId } },
        academicYear: {
          connect: { id: academicYearId },
        },
      },
    });
  }

  async findAll(
    queryTeachingAllocationDto: QueryTeachingAllocationDto,
  ): Promise<PaginatedResponseDto<TeachingAllocationResponseDto>> {
    const {
      teacherId,
      subjectId,
      classId,
      academicYearId,
      page = 1,
      limit = 10,
    } = queryTeachingAllocationDto;
    const where: Prisma.TeachingAllocationWhereInput = {};

    if (teacherId) where.teacherId = teacherId;
    if (subjectId) where.subjectId = subjectId;
    if (classId) where.classId = classId;
    if (academicYearId) where.academicYearId = academicYearId;

    const total = await this.prisma.teachingAllocation.count({ where });
    const teachingAllocations = await this.prisma.teachingAllocation.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
    });

    return {
      data: teachingAllocations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<TeachingAllocationResponseDto> {
    const teachingAllocation = await this.prisma.teachingAllocation.findUnique({
      where: { id },
    });
    if (!teachingAllocation)
      throw new NotFoundException('Teaching assignment is not found');
    return teachingAllocation;
  }

  async update(
    id: string,
    updateTeachingAllocationDto: UpdateTeachingAllocationDto,
  ): Promise<TeachingAllocationResponseDto> {
    const existingTeachingAllocation =
      await this.prisma.teachingAllocation.findUnique({ where: { id } });
    if (!existingTeachingAllocation)
      throw new NotFoundException('Teaching assignment is not found');

    return await this.prisma.teachingAllocation.update({
      where: { id },
      data: {
        teacher: updateTeachingAllocationDto.teacherId
          ? { connect: { id: updateTeachingAllocationDto.teacherId } }
          : undefined,
        subject: updateTeachingAllocationDto.subjectId
          ? { connect: { id: updateTeachingAllocationDto.subjectId } }
          : undefined,
        class: updateTeachingAllocationDto.classId
          ? { connect: { id: updateTeachingAllocationDto.classId } }
          : undefined,
        academicYear: updateTeachingAllocationDto.academicYearId
          ? { connect: { id: updateTeachingAllocationDto.academicYearId } }
          : undefined,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingTeachingAllocation =
      await this.prisma.teachingAllocation.findUnique({ where: { id } });
    if (!existingTeachingAllocation)
      throw new NotFoundException('Teaching assignment is not found');

    await this.prisma.teachingAllocation.delete({ where: { id } });
    return { message: 'Teaching assignment deleted successfully' };
  }
}
