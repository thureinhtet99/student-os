import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { formatClass } from '../../common/formatters/class.formatter';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ClassResponseDto } from './dto/class-response-dto';
import { CreateClassDto } from './dto/create-class.dto';
import { QueryClassDto } from './dto/query-class-dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto): Promise<ClassResponseDto> {
    const existingClass = await this.prisma.class.findFirst({
      where: {
        name: {
          equals: createClassDto.name.trim(),
          mode: 'insensitive',
        },
      },
    });
    if (existingClass)
      throw new BadRequestException('Class with this name already exists');

    const classItem = await this.prisma.class.create({
      data: {
        name: createClassDto.name,
        teacher: createClassDto.teacher_id
          ? {
              connect: { id: createClassDto.teacher_id },
            }
          : undefined,
      },
      include: {
        teacher: true,
      },
    });

    return formatClass(classItem);
  }

  async findAll(
    queryClassDto: QueryClassDto,
  ): Promise<PaginatedResponseDto<ClassResponseDto>> {
    const { limit = 10, page = 1, teacher, search } = queryClassDto;

    const where: Prisma.ClassWhereInput = {};

    if (teacher) where.teacherId = teacher;

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.class.count({ where });

    const classItems = await this.prisma.class.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        teacher: { omit: { password: true } },
        students: { omit: { password: true } },
        subjects: true,
        events: true,
        announcements: true,
      },
    });

    return {
      data: classItems.map((item) => formatClass(item)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
