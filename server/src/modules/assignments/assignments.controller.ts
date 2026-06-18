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
import { CreateAssignmentDto } from './dto/create-assignment.dto.js';
import { QueryAssignmentDto } from './dto/query-assignment-dto.js';
import { AssignmentResponseDto } from './dto/assignment-response.dto.js';
import { UpdateAssignmentDto } from './dto/update-assignment.dto.js';
import { AssignmentsService } from './assignments.service.js';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  async findAll(
    @Query() queryAssignmentDto: QueryAssignmentDto,
  ): Promise<PaginatedResponseDto<AssignmentResponseDto>> {
    return this.assignmentsService.findAll(queryAssignmentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AssignmentResponseDto> {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.assignmentsService.remove(id);
  }
}
