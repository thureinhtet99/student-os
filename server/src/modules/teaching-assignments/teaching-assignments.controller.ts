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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto.js';
import { QueryTeachingAssignmentDto } from './dto/query-teaching-assignment.dto.js';
import { TeachingAssignmentResponseDto } from './dto/teaching-assignment-response.dto.js';
import { UpdateTeachingAssignmentDto } from './dto/update-teaching-assignment.dto.js';
import { TeachingAssignmentsService } from './teaching-assignments.service.js';

@ApiTags('Teaching Assignments')
@Roles(TEACHING_ROLES)
@Controller('teaching-assignments')
export class TeachingAssignmentsController {
  constructor(
    private readonly teachingAssignmentsService: TeachingAssignmentsService,
  ) {}

  @ApiOperation({ summary: 'Create teaching assignment' })
  @ApiResponse({ status: 201, type: TeachingAssignmentResponseDto })
  @Post()
  create(
    @Body() createTeachingAssignmentDto: CreateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponseDto> {
    return this.teachingAssignmentsService.create(createTeachingAssignmentDto);
  }

  @ApiOperation({ summary: 'List teaching assignments' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  @Get()
  findAll(
    @Query() queryTeachingAssignmentDto: QueryTeachingAssignmentDto,
  ): Promise<PaginatedResponseDto<TeachingAssignmentResponseDto>> {
    return this.teachingAssignmentsService.findAll(queryTeachingAssignmentDto);
  }

  @ApiOperation({ summary: 'Get teaching assignment by id' })
  @ApiResponse({ status: 200, type: TeachingAssignmentResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<TeachingAssignmentResponseDto> {
    return this.teachingAssignmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update teaching assignment' })
  @ApiResponse({ status: 200, type: TeachingAssignmentResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeachingAssignmentDto: UpdateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponseDto> {
    return this.teachingAssignmentsService.update(
      id,
      updateTeachingAssignmentDto,
    );
  }

  @ApiOperation({ summary: 'Delete teaching assignment' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { message: 'Teaching assignment deleted successfully' },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.teachingAssignmentsService.remove(id);
  }
}
