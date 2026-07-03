import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatSubject } from '../../common/formatters/subject.formatter.js';
import { SubjectWithRelations } from '../../common/types/subject.type.js';
import { checkDuplicate } from '../../common/utils/db.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { QuerySubjectDto } from './dto/query-subject-dto.js';
import { SubjectResponseDto } from './dto/subject-response.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    await checkDuplicate(
      this.prisma.subject,
      'name',
      createSubjectDto.name,
      null,
      'Subject with this name already exists',
    );

    const subject = await this.prisma.subject.create({
      data: {
        name: createSubjectDto.name.trim(),
        description: createSubjectDto.description?.trim() || null,
      },
      include: {
        teachingAssignments: true,
      },
    });

    return formatSubject(subject as SubjectWithRelations);
  }

  async findAll(
    querySubjectDto: QuerySubjectDto,
  ): Promise<PaginatedResponseDto<SubjectResponseDto>> {
    const { search, page = 1, limit = 10 } = querySubjectDto;

    const where: Prisma.SubjectWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.subject.count({ where });

    const subjects = await this.prisma.subject.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        teachingAssignments: true,
      },
    });

    return {
      data: subjects.map((subject) => formatSubject(subject as SubjectWithRelations)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<SubjectResponseDto> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        teachingAssignments: true,
      },
    });

    if (!subject) throw new NotFoundException('Subject is not found');

    return formatSubject(subject as SubjectWithRelations);
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { id },
    });
    if (!existingSubject) throw new NotFoundException('Subject is not found');

    if (
      updateSubjectDto.name &&
      existingSubject.name.toLowerCase() !==
        updateSubjectDto.name.trim().toLowerCase()
    ) {
      await checkDuplicate(
        this.prisma.subject,
        'name',
        updateSubjectDto.name,
        id,
        'Subject with this name already exists',
      );
    }

    const subject = await this.prisma.subject.update({
      where: { id },
      data: {
        name: updateSubjectDto.name?.trim(),
        description:
          updateSubjectDto.description === undefined
            ? undefined
            : updateSubjectDto.description?.trim() || null,
      },
      include: {
        teachingAssignments: true,
      },
    });

    return formatSubject(subject as SubjectWithRelations);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { id },
    });
    if (!existingSubject) throw new NotFoundException('Subject is not found');

    await this.prisma.subject.delete({ where: { id } });

    return { message: 'Subject deleted successfully' };
  }
}
