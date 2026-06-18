import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatLesson } from '../../common/formatters/lesson.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { QueryLessonDto } from './dto/query-lesson-dto.js';
import { LessonResponseDto } from './dto/lesson-response.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto): Promise<LessonResponseDto> {
    const lesson = await this.prisma.lesson.create({
      data: {
        name: createLessonDto.name.trim(),
        subject: createLessonDto.subject_id
          ? { connect: { id: createLessonDto.subject_id } }
          : undefined,
      },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return formatLesson(lesson);
  }

  async findAll(
    queryLessonDto: QueryLessonDto,
  ): Promise<PaginatedResponseDto<LessonResponseDto>> {
    const { search, page = 1, limit = 10 } = queryLessonDto;

    const where: Prisma.LessonWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.lesson.count({ where });

    const lessons = await this.prisma.lesson.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return {
      data: lessons.map((lesson) => formatLesson(lesson)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<LessonResponseDto> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    if (!lesson) throw new NotFoundException('Lesson is not found');

    return formatLesson(lesson);
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    const existingLesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!existingLesson) throw new NotFoundException('Lesson is not found');

    const lesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        name: updateLessonDto.name?.trim(),
        subject:
          updateLessonDto.subject_id === undefined
            ? undefined
            : updateLessonDto.subject_id
              ? { connect: { id: updateLessonDto.subject_id } }
              : { disconnect: true },
      },
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    return formatLesson(lesson);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingLesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!existingLesson) throw new NotFoundException('Lesson is not found');

    await this.prisma.lesson.delete({ where: { id } });

    return { message: 'Lesson deleted successfully' };
  }
}
