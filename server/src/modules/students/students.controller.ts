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
import { CreateStudentDto } from './dto/create-student.dto.js';
import { QueryStudentDto } from './dto/query-student-dto.js';
import { StudentResponseDto } from './dto/student-response.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentsService } from './students.service.js';

@AllowAnonymous()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // Create student
  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.create(createStudentDto);
  }

  // Get all students
  @Get()
  async findAll(
    @Query() queryStudentDto: QueryStudentDto,
  ): Promise<PaginatedResponseDto<StudentResponseDto>> {
    return this.studentsService.findAll(queryStudentDto);
  }

  // @Get('class/:classId')
  // findByClass(@Param('classId') classId: string) {
  //   return this.studentsService.findByClass(+classId);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.studentsService.remove(id);
  }
}
