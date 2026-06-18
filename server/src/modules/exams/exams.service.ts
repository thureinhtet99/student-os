import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatExam } from '../../common/formatters/exam.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { QueryExamDto } from './dto/query-exam-dto.js';
import { ExamResponseDto } from './dto/exam-response.dto.js';
import { UpdateExamDto } from './dto/update-exam.dto.js';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto): Promise<ExamResponseDto> {
    const exam = await this.prisma.exam.create({
      data: {
        name: createExamDto.name.trim(),
        description: createExamDto.description?.trim() || null,
        startTime: new Date(createExamDto.startTime),
        endTime: new Date(createExamDto.endTime),
        subject: { connect: { id: createExamDto.subject_id } },
      },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return formatExam(exam);
  }

  async findAll(
    queryExamDto: QueryExamDto,
  ): Promise<PaginatedResponseDto<ExamResponseDto>> {
    const { search, page = 1, limit = 10 } = queryExamDto;

    const where: Prisma.ExamWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.exam.count({ where });

    const exams = await this.prisma.exam.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startTime: 'desc' },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return {
      data: exams.map((exam) => formatExam(exam)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ExamResponseDto> {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    if (!exam) throw new NotFoundException('Exam is not found');

    return formatExam(exam);
  }

  async update(
    id: string,
    updateExamDto: UpdateExamDto,
  ): Promise<ExamResponseDto> {
    const existingExam = await this.prisma.exam.findUnique({ where: { id } });
    if (!existingExam) throw new NotFoundException('Exam is not found');

    const exam = await this.prisma.exam.update({
      where: { id },
      data: {
        name: updateExamDto.name?.trim(),
        description:
          updateExamDto.description === undefined
            ? undefined
            : updateExamDto.description?.trim() || null,
        startTime: updateExamDto.startTime
          ? new Date(updateExamDto.startTime)
          : undefined,
        endTime: updateExamDto.endTime
          ? new Date(updateExamDto.endTime)
          : undefined,
        subject: updateExamDto.subject_id
          ? { connect: { id: updateExamDto.subject_id } }
          : undefined,
      },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return formatExam(exam);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingExam = await this.prisma.exam.findUnique({ where: { id } });
    if (!existingExam) throw new NotFoundException('Exam is not found');

    await this.prisma.exam.delete({ where: { id } });

    return { message: 'Exam deleted successfully' };
  }
}
