import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
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
import { CreateExamDto } from './dto/create-exam.dto.js';
import { QueryExamDto } from './dto/query-exam-dto.js';
import { ExamResponseDto } from './dto/exam-response.dto.js';
import { UpdateExamDto } from './dto/update-exam.dto.js';
import { ExamsService } from './exams.service.js';

@AllowAnonymous()
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  async create(@Body() createExamDto: CreateExamDto): Promise<ExamResponseDto> {
    return this.examsService.create(createExamDto);
  }

  @Get()
  async findAll(
    @Query() queryExamDto: QueryExamDto,
  ): Promise<PaginatedResponseDto<ExamResponseDto>> {
    return this.examsService.findAll(queryExamDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExamResponseDto> {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
  ): Promise<ExamResponseDto> {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.examsService.remove(id);
  }
}
