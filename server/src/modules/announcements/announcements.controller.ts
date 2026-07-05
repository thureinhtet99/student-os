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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto.js';
import { AnnouncementsService } from './announcements.service.js';
import { AnnouncementResponseDto } from './dto/announcement-response.dto.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { QueryAnnouncementDto } from './dto/query-announcement-dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';

@ApiTags('Announcements')
@Roles(TEACHING_ROLES)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @ApiOperation({ summary: 'Create announcement' })
  @ApiOkResponse({ type: AnnouncementResponseDto })
  @Post()
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @ApiOperation({ summary: 'List announcements' })
  @ApiPaginatedResponse(AnnouncementResponseDto)
  @Get()
  async findAll(
    @Query() queryAnnouncementDto: QueryAnnouncementDto,
  ): Promise<PaginatedResponseDto<AnnouncementResponseDto>> {
    return this.announcementsService.findAll(queryAnnouncementDto);
  }

  @ApiOperation({ summary: 'Get announcement by id' })
  @ApiOkResponse({ type: AnnouncementResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AnnouncementResponseDto> {
    return this.announcementsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update announcement' })
  @ApiOkResponse({ type: AnnouncementResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @ApiOperation({ summary: 'Delete announcement' })
  @ApiOkResponse({
    schema: { example: { message: 'Announcement deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.announcementsService.remove(id);
  }
}
