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
import { CreateExamDto } from './dto/create-exam.dto.js';
import { ExamResponseDto } from './dto/exam-response.dto.js';
import { QueryExamDto } from './dto/query-exam-dto.js';
import { UpdateExamDto } from './dto/update-exam.dto.js';
import { ExamsService } from './exams.service.js';

@ApiTags('Exams')
@Roles(TEACHING_ROLES)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiOperation({ summary: 'Create exam' })
  @ApiOkResponse({ type: ExamResponseDto })
  @Post()
  async create(@Body() createExamDto: CreateExamDto): Promise<ExamResponseDto> {
    return this.examsService.create(createExamDto);
  }

  @ApiOperation({ summary: 'List exams' })
  @ApiPaginatedResponse(ExamResponseDto)
  @Get()
  async findAll(
    @Query() queryExamDto: QueryExamDto,
  ): Promise<PaginatedResponseDto<ExamResponseDto>> {
    return this.examsService.findAll(queryExamDto);
  }

  @ApiOperation({ summary: 'Get exam by id' })
  @ApiOkResponse({ type: ExamResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExamResponseDto> {
    return this.examsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update exam' })
  @ApiOkResponse({ type: ExamResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
  ): Promise<ExamResponseDto> {
    return this.examsService.update(id, updateExamDto);
  }

  @ApiOperation({ summary: 'Delete exam' })
  @ApiOkResponse({
    schema: { example: { message: 'Exam deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.examsService.remove(id);
  }
}
