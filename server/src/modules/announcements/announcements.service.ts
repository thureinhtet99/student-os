import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatAnnouncement } from '../../common/formatters/announcement.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { AnnouncementResponseDto } from './dto/announcement-response.dto.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { QueryAnnouncementDto } from './dto/query-announcement-dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';
import { checkDuplicate } from '../../common/utils/db.util.js';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    const { title } = createAnnouncementDto;

    await checkDuplicate(
      this.prisma.announcement,
      'title',
      title,
      null,
      'Announcement with this title already exists',
    );

    const announcement = await this.prisma.announcement.create({
      data: {
        title: createAnnouncementDto.title.trim(),
        content: createAnnouncementDto.content.trim(),
        publishedAt: new Date(createAnnouncementDto.publishedAt),
        classId: createAnnouncementDto.classId,
      },
      include: { class: true },
    });

    return formatAnnouncement(announcement);
  }

  async findAll(
    queryAnnouncementDto: QueryAnnouncementDto,
  ): Promise<PaginatedResponseDto<AnnouncementResponseDto>> {
    const { search, classId, page = 1, limit = 10 } = queryAnnouncementDto;

    const where: Prisma.AnnouncementWhereInput = {};

    if (classId) where.classId = classId;

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.announcement.count({ where });

    const announcements = await this.prisma.announcement.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { class: true },
    });

    return {
      data: announcements.map(formatAnnouncement),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<AnnouncementResponseDto> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!announcement) throw new NotFoundException('Announcement is not found');

    return formatAnnouncement(announcement);
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    const existingAnnouncement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!existingAnnouncement)
      throw new NotFoundException('Announcement is not found');

    const data: Prisma.AnnouncementUpdateInput = {};

    if (updateAnnouncementDto.title !== undefined)
      data.title = updateAnnouncementDto.title.trim();
    if (updateAnnouncementDto.content !== undefined)
      data.content = updateAnnouncementDto.content?.trim() ?? null;
    if (updateAnnouncementDto.publishedAt !== undefined)
      data.publishedAt = new Date(updateAnnouncementDto.publishedAt);
    if (updateAnnouncementDto.classId !== undefined) {
      data.class = updateAnnouncementDto.classId
        ? { connect: { id: updateAnnouncementDto.classId } }
        : { disconnect: true };
    }

    const announcement = await this.prisma.announcement.update({
      where: { id },
      data,
      include: { class: true },
    });

    return formatAnnouncement(announcement);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingAnnouncement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!existingAnnouncement)
      throw new NotFoundException('Announcement is not found');

    await this.prisma.announcement.delete({ where: { id } });

    return { message: 'Announcement deleted successfully' };
  }
}
