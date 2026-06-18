import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { AnnouncementsService } from './announcements.service.js';
import { AnnouncementResponseDto } from './dto/announcement-response.dto.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { QueryAnnouncementDto } from './dto/query-announcement-dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Get()
  async findAll(
    @Query() queryAnnouncementDto: QueryAnnouncementDto,
  ): Promise<PaginatedResponseDto<AnnouncementResponseDto>> {
    return this.announcementsService.findAll(queryAnnouncementDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AnnouncementResponseDto> {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.announcementsService.remove(id);
  }
}
