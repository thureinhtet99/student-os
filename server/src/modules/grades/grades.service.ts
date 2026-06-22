import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatGrade } from '../../common/formatters/grade.formatter.js';
// import { checkDuplicate } from '../../common/utils/db.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
// import { CreateGradeDto } from './dto/create-grade.dto.js';
import { GradeResponseDto } from './dto/grade-response.dto.js';
import { QueryGradeDto } from './dto/query-grade-dto.js';
// import { UpdateGradeDto } from './dto/update-grade.dto.js';

@Injectable()
export class GradesService {
  constructor(private readonly prisma: PrismaService) {}

  // async create(createGradeDto: CreateGradeDto): Promise<GradeResponseDto> {
  //   await checkDuplicate(
  //     this.prisma.grade,
  //     'level',
  //     createGradeDto.level,
  //     null,
  //     'Grade with this level already exists',
  //   );

  //   const grade = await this.prisma.grade.create({
  //     data: {
  //       level: createGradeDto.level,
  //     },
  //   });

  //   return formatGrade(grade);
  // }

  async findAll(
    queryGradeDto: QueryGradeDto,
  ): Promise<PaginatedResponseDto<GradeResponseDto>> {
    const { page = 1, limit = 10 } = queryGradeDto;

    const total = await this.prisma.grade.count();

    const grades = await this.prisma.grade.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { level: 'asc' },
    });

    return {
      data: grades.map((grade) => formatGrade(grade)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<GradeResponseDto> {
    const grade = await this.prisma.grade.findUnique({ where: { id } });

    if (!grade) throw new NotFoundException('Grade is not found');

    return formatGrade(grade);
  }

  // async update(
  //   id: string,
  //   updateGradeDto: UpdateGradeDto,
  // ): Promise<GradeResponseDto> {
  //   const existingGrade = await this.prisma.grade.findUnique({ where: { id } });
  //   if (!existingGrade) throw new NotFoundException('Grade is not found');

  //   if (
  //     updateGradeDto.level !== undefined &&
  //     existingGrade.level !== updateGradeDto.level
  //   ) {
  //     await checkDuplicate(
  //       this.prisma.grade,
  //       'level',
  //       updateGradeDto.level,
  //       id,
  //       'Grade with this level already exists',
  //     );
  //   }

  //   const grade = await this.prisma.grade.update({
  //     where: { id },
  //     data: {
  //       level: updateGradeDto.level,
  //     },
  //   });

  //   return formatGrade(grade);
  // }

  async remove(id: string): Promise<{ message: string }> {
    const existingGrade = await this.prisma.grade.findUnique({ where: { id } });
    if (!existingGrade) throw new NotFoundException('Grade is not found');

    await this.prisma.grade.delete({ where: { id } });

    return { message: 'Grade deleted successfully' };
  }
}
