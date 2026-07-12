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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { ADMIN_ROLES } from '../../common/constants/role.constant.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto.js';
import { ClassesService } from './classes.service.js';
import { ClassResponseDto } from './dto/class-response-dto.js';
import { CreateClassResponse } from './dto/create-class-response.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { QueryClassDto } from './dto/query-class-dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';

@ApiTags('Classes')
@Roles(ADMIN_ROLES)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create a class for an academic year' })
  @ApiCreatedResponse({ type: CreateClassResponse })
  @Post()
  async create(
    @Body() createClassDto: CreateClassDto,
  ): Promise<CreateClassResponse> {
    return this.classesService.create(createClassDto);
  }

  @ApiOperation({ summary: 'List classes' })
  @ApiPaginatedResponse(ClassResponseDto)
  @Get()
  async findAll(
    @Query() queryClassDto: QueryClassDto,
  ): Promise<PaginatedResponseDto<ClassResponseDto>> {
    return this.classesService.findAll(queryClassDto);
  }

  @ApiOperation({ summary: 'Get a class by id' })
  @ApiOkResponse({ type: ClassResponseDto })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('academicYearId') academicYearId?: string,
  ): Promise<ClassResponseDto> {
    return this.classesService.findOne(id, academicYearId);
  }

  @ApiOperation({ summary: 'Update a class' })
  @ApiOkResponse({ type: ClassResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.update(id, updateClassDto);
  }

  @ApiOperation({
    summary: 'Archive a class (soft delete)',
    description: 'This performs a soft delete, preserving all related data.',
  })
  @ApiOkResponse({
    schema: { example: { message: 'Class archived successfully' } },
  })
  @Delete(':id/archive')
  async archive(@Param('id') id: string): Promise<{ message: string }> {
    return this.classesService.archive(id);
  }

  @ApiOperation({
    summary: 'Permanently delete a class (destructive)',
    description:
      'Warning: This action is irreversible and will delete the class and all its associated data, including enrollments, attendance, exams, and timetables.',
  })
  @ApiOkResponse({
    schema: { example: { message: 'Class permanently deleted successfully' } },
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.classesService.delete(id);
  }
}
