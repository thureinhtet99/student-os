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
import { CreateStudentDto } from './dto/create-student.dto.js';
import { QueryStudentDto } from './dto/query-student-dto.js';
import { StudentResponseDto } from './dto/student-response.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentsService } from './students.service.js';

@ApiTags('Students')
@Roles(ADMIN_ROLES)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Create a student' })
  @ApiOkResponse({ type: StudentResponseDto })
  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.create(createStudentDto);
  }

  @ApiOperation({ summary: 'List students' })
  @ApiPaginatedResponse(StudentResponseDto)
  @Get()
  async findAll(
    @Query() queryStudentDto: QueryStudentDto,
  ): Promise<PaginatedResponseDto<StudentResponseDto>> {
    return this.studentsService.findAll(queryStudentDto);
  }

  @ApiOperation({ summary: 'Get a student by id' })
  @ApiOkResponse({ type: StudentResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a student' })
  @ApiOkResponse({ type: StudentResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Delete a student' })
  @ApiOkResponse({
    schema: { example: { message: 'Student deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.studentsService.remove(id);
  }
}
