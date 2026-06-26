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
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { ADMIN_ROLES } from '../../common/constants/role.constant.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { QueryTeacherDto } from './dto/query-teacher-dto.js';
import { TeacherResponseDto } from './dto/teacher-response.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { TeachersService } from './teachers.service.js';

@Roles(ADMIN_ROLES)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  async findAll(
    @Query() queryTeacherDto: QueryTeacherDto,
  ): Promise<PaginatedResponseDto<TeacherResponseDto>> {
    return this.teachersService.findAll(queryTeacherDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TeacherResponseDto> {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.teachersService.remove(id);
  }
}
