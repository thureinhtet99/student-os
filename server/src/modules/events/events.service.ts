import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatEvent } from '../../common/formatters/event.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { EventResponseDto } from './dto/event-response.dto.js';
import { QueryEventDto } from './dto/query-event-dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const event = await this.prisma.event.create({
      data: {
        name: createEventDto.name.trim(),
        description: createEventDto.description?.trim() || null,
        startTime: new Date(createEventDto.startTime),
        endTime: new Date(createEventDto.endTime),
        ...(createEventDto.classId !== undefined && {
          classId: createEventDto.classId,
        }),
      },
      include: { class: true },
    });

    return formatEvent(event);
  }

  async findAll(
    queryEventDto: QueryEventDto,
  ): Promise<PaginatedResponseDto<EventResponseDto>> {
    const { search, classId, page = 1, limit = 10 } = queryEventDto;

    const where: Prisma.EventWhereInput = {};

    if (classId) where.classId = classId;

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.event.count({ where });

    const events = await this.prisma.event.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startTime: 'desc' },
      include: { class: true },
    });

    return {
      data: events.map((event) => formatEvent(event)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!event) throw new NotFoundException('Event is not found');

    return formatEvent(event);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const existingEvent = await this.prisma.event.findUnique({ where: { id } });
    if (!existingEvent) throw new NotFoundException('Event is not found');

    const event = await this.prisma.event.update({
      where: { id },
      data: {
        name: updateEventDto.name?.trim(),
        description:
          updateEventDto.description === undefined
            ? undefined
            : updateEventDto.description?.trim() || null,
        startTime: updateEventDto.startTime
          ? new Date(updateEventDto.startTime)
          : undefined,
        endTime: updateEventDto.endTime
          ? new Date(updateEventDto.endTime)
          : undefined,
        class:
          updateEventDto.classId === undefined
            ? undefined
            : updateEventDto.classId
              ? { connect: { id: updateEventDto.classId } }
              : { disconnect: true },
      },
      include: { class: true },
    });

    return formatEvent(event);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingEvent = await this.prisma.event.findUnique({ where: { id } });
    if (!existingEvent) throw new NotFoundException('Event is not found');

    await this.prisma.event.delete({ where: { id } });

    return { message: 'Event deleted successfully' };
  }
}
