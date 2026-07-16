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
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { QueryTeacherDto } from './dto/query-teacher-dto.js';
import { TeacherResponseDto } from './dto/teacher-response.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { TeachersService } from './teachers.service.js';

@ApiTags('Teachers')
@Controller('teachers')
@Roles(ADMIN_ROLES)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @ApiOperation({ summary: 'Create a teacher' })
  @ApiCreatedResponse({ type: TeacherResponseDto })
  @Post()
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.create(createTeacherDto);
  }

  @ApiOperation({ summary: 'List teachers' })
  @ApiPaginatedResponse(TeacherResponseDto)
  @Get()
  async findAll(
    @Query() queryTeacherDto: QueryTeacherDto,
  ): Promise<PaginatedResponseDto<TeacherResponseDto>> {
    return this.teachersService.findAll(queryTeacherDto);
  }

  @ApiOperation({ summary: 'Get a teacher by id' })
  @ApiOkResponse({ type: TeacherResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TeacherResponseDto> {
    return this.teachersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a teacher' })
  @ApiOkResponse({ type: TeacherResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiOkResponse({
    schema: { example: { message: 'Teacher deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.teachersService.remove(id);
  }
}
