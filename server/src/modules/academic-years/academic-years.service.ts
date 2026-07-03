import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import type { AcademicYearModel } from '../../../prisma/generated/prisma/models/AcademicYear.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { AcademicYearResponseDto } from './dto/academic-year-response.dto.js';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto.js';
import { QueryAcademicYearDto } from './dto/query-academic-year.dto.js';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto.js';

@Injectable()
export class AcademicYearsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAcademicYearDto: CreateAcademicYearDto,
  ): Promise<AcademicYearResponseDto> {
    const academicYear = await this.prisma.academicYear.create({
      data: {
        name: createAcademicYearDto.name.trim(),
        startDate: new Date(createAcademicYearDto.startDate),
        endDate: new Date(createAcademicYearDto.endDate),
        isCurrent: createAcademicYearDto.isCurrent ?? false,
      },
    });

    return academicYear as AcademicYearModel;
  }

  async findAll(
    queryAcademicYearDto: QueryAcademicYearDto,
  ): Promise<PaginatedResponseDto<AcademicYearResponseDto>> {
    const { search, page = 1, limit = 10 } = queryAcademicYearDto;

    const where: Prisma.AcademicYearWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.academicYear.count({ where });

    const academicYears = await this.prisma.academicYear.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startDate: 'desc' },
    });

    return {
      data: academicYears as AcademicYearModel[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<AcademicYearResponseDto> {
    const academicYear = await this.prisma.academicYear.findUnique({
      where: { id },
    });

    if (!academicYear)
      throw new NotFoundException('Academic year is not found');

    return academicYear as AcademicYearModel;
  }

  async update(
    id: string,
    updateAcademicYearDto: UpdateAcademicYearDto,
  ): Promise<AcademicYearResponseDto> {
    const existingAcademicYear = await this.prisma.academicYear.findUnique({
      where: { id },
    });

    if (!existingAcademicYear) {
      throw new NotFoundException('Academic year is not found');
    }

    return (await this.prisma.academicYear.update({
      where: { id },
      data: {
        name: updateAcademicYearDto.name?.trim(),
        startDate: updateAcademicYearDto.startDate
          ? new Date(updateAcademicYearDto.startDate)
          : undefined,
        endDate: updateAcademicYearDto.endDate
          ? new Date(updateAcademicYearDto.endDate)
          : undefined,
        isCurrent: updateAcademicYearDto.isCurrent,
      },
    })) as AcademicYearModel;
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingAcademicYear = await this.prisma.academicYear.findUnique({
      where: { id },
    });

    if (!existingAcademicYear) {
      throw new NotFoundException('Academic year is not found');
    }

    await this.prisma.academicYear.delete({ where: { id } });

    return { message: 'Academic year deleted successfully' };
  }
}
