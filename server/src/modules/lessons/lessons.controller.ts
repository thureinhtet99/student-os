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
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { QueryLessonDto } from './dto/query-lesson-dto.js';
import { LessonResponseDto } from './dto/lesson-response.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { LessonsService } from './lessons.service.js';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  async create(
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  async findAll(
    @Query() queryLessonDto: QueryLessonDto,
  ): Promise<PaginatedResponseDto<LessonResponseDto>> {
    return this.lessonsService.findAll(queryLessonDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LessonResponseDto> {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.lessonsService.remove(id);
  }
}
