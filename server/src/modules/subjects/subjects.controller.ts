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
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { QuerySubjectDto } from './dto/query-subject-dto.js';
import { SubjectResponseDto } from './dto/subject-response.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { SubjectsService } from './subjects.service.js';

@AllowAnonymous()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  async findAll(
    @Query() querySubjectDto: QuerySubjectDto,
  ): Promise<PaginatedResponseDto<SubjectResponseDto>> {
    return this.subjectsService.findAll(querySubjectDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SubjectResponseDto> {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.subjectsService.remove(id);
  }
}
