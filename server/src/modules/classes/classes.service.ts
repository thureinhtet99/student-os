import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { AcademicYearContextService } from '../../common/academic-year-context/academic-year-context.service.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatClass } from '../../common/formatters/class.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { ClassResponseDto } from './dto/class-response-dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { QueryClassDto } from './dto/query-class-dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';

@Injectable()
export class ClassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly academicYearContext: AcademicYearContextService,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<ClassResponseDto> {
    const className = createClassDto.name.trim();

    // const academicYearId =
    //   createClassDto.academicYearId ??
    //   (await this.academicYearContext.getActiveId());

    const existingClass = await this.prisma.class.findFirst({
      where: {
        name: className,
      },
    });

    if (existingClass)
      throw new ConflictException(
        'Class with this name already exists for this year',
      );

    const classItem = await this.prisma.class.create({
      data: {
        name: className,
        // academicYear: {
        //   connect: { id: academicYearId },
        // },
      },
    });

    return formatClass(classItem);
  }

  async findAll(
    queryClassDto: QueryClassDto,
  ): Promise<PaginatedResponseDto<ClassResponseDto>> {
    const { limit = 10, page = 1, search } = queryClassDto;

    // const effectiveAcademicYearId =
    //   academicYearId ?? (await this.academicYearContext.getActiveId());

    const where: Prisma.ClassWhereInput = {};

    // if (effectiveAcademicYearId) where.academicYearId = effectiveAcademicYearId;

    if (search) where.name = { contains: search, mode: 'insensitive' };

    const total = await this.prisma.class.count({ where });

    const classItems = await this.prisma.class.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });

    return {
      data: classItems.map(formatClass),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ClassResponseDto> {
    const classById = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!classById) throw new NotFoundException('Class is not found');

    return formatClass(classById);
  }

  async update(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    const existingClass = await this.prisma.class.findUnique({
      where: { id },
    });
    if (!existingClass) throw new NotFoundException('Class is not found');

    if (
      updateClassDto.name &&
      existingClass.name.toLowerCase() !==
        updateClassDto.name.trim().toLowerCase()
    ) {
      const duplicateClass = await this.prisma.class.findFirst({
        where: {
          name: updateClassDto.name.trim(),
          NOT: { id },
        },
      });

      if (duplicateClass)
        throw new ConflictException('Class with this name already exists');
    }

    const data: Prisma.ClassUpdateInput = {};

    if (updateClassDto.name !== undefined)
      data.name = updateClassDto.name.trim();

    const classItem = await this.prisma.class.update({
      where: { id },
      data,
    });

    return formatClass(classItem);
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
