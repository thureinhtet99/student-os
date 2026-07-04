import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatResult } from '../../common/formatters/result.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateResultDto } from './dto/create-result.dto.js';
import { QueryResultDto } from './dto/query-result-dto.js';
import { ResultResponseDto } from './dto/result-response.dto.js';
import { UpdateResultDto } from './dto/update-result.dto.js';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResultDto: CreateResultDto): Promise<ResultResponseDto> {
    const examId = createResultDto.exam_id?.trim();

    const result = await this.prisma.result.create({
      data: {
        score: createResultDto.score,
        comment: createResultDto.comment?.trim() || null,
        examId,
        academicYearId: createResultDto.academicYearId,
        enrollmentId: createResultDto.enrollmentId,
      },
    });

    return formatResult(result);
  }

  async findAll(
    queryResultDto: QueryResultDto,
  ): Promise<PaginatedResponseDto<ResultResponseDto>> {
    const { enrollmentId, page = 1, limit = 10 } = queryResultDto;

    const where: Prisma.ResultWhereInput = {};

    if (enrollmentId) where.enrollmentId = enrollmentId;

    const total = await this.prisma.result.count({ where });

    const results = await this.prisma.result.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'desc' },
    });

    return {
      data: results.map((result) => formatResult(result)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ResultResponseDto> {
    const result = await this.prisma.result.findUnique({
      where: { id },
    });

    if (!result) throw new NotFoundException('Result is not found');

    return formatResult(result);
  }

  async update(
    id: string,
    updateResultDto: UpdateResultDto,
  ): Promise<ResultResponseDto> {
    const existingResult = await this.prisma.result.findUnique({
      where: { id },
    });
    if (!existingResult) throw new NotFoundException('Result is not found');

    const result = await this.prisma.result.update({
      where: { id },
      data: {
        score: updateResultDto.score,
        comment:
          updateResultDto.comment === undefined
            ? undefined
            : updateResultDto.comment?.trim() || null,
        exam:
          updateResultDto.exam_id === undefined
            ? undefined
            : updateResultDto.exam_id
              ? { connect: { id: updateResultDto.exam_id } }
              : undefined,
        academicYear: updateResultDto.academicYearId
          ? { connect: { id: updateResultDto.academicYearId } }
          : undefined,
        enrollment: updateResultDto.enrollmentId
          ? { connect: { id: updateResultDto.enrollmentId } }
          : undefined,
      },
    });

    return formatResult(result);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingResult = await this.prisma.result.findUnique({
      where: { id },
    });
    if (!existingResult) throw new NotFoundException('Result is not found');

    await this.prisma.result.delete({ where: { id } });

    return { message: 'Result deleted successfully' };
  }
}
