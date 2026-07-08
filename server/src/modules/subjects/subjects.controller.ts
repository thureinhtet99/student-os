import { Roles } from '@thallesp/nestjs-better-auth';
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
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto.js';
import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { QuerySubjectDto } from './dto/query-subject-dto.js';
import { SubjectResponseDto } from './dto/subject-response.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { SubjectsService } from './subjects.service.js';

@ApiTags('Subjects')
@Roles(TEACHING_ROLES)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @ApiOperation({ summary: 'Create a subject' })
  @ApiOkResponse({ type: SubjectResponseDto })
  @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectsService.create(createSubjectDto);
  }

  @ApiOperation({ summary: 'List subjects' })
  @ApiPaginatedResponse(SubjectResponseDto)
  @Get()
  async findAll(
    @Query() querySubjectDto: QuerySubjectDto,
  ): Promise<PaginatedResponseDto<SubjectResponseDto>> {
    return this.subjectsService.findAll(querySubjectDto);
  }

  @ApiOperation({ summary: 'Get a subject by id' })
  @ApiOkResponse({ type: SubjectResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SubjectResponseDto> {
    return this.subjectsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a subject' })
  @ApiOkResponse({ type: SubjectResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @ApiOperation({ summary: 'Delete a subject' })
  @ApiOkResponse({
    schema: { example: { message: 'Subject deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.subjectsService.remove(id);
  }
}
