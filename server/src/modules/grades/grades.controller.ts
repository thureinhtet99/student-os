import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { GradeResponseDto } from './dto/grade-response.dto.js';
import { QueryGradeDto } from './dto/query-grade-dto.js';
import { GradesService } from './grades.service.js';

@AllowAnonymous()
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // @Post()
  // async create(
  //   @Body() createGradeDto: CreateGradeDto,
  // ): Promise<GradeResponseDto> {
  //   return this.gradesService.create(createGradeDto);
  // }

  @Get()
  async findAll(
    @Query() queryGradeDto: QueryGradeDto,
  ): Promise<PaginatedResponseDto<GradeResponseDto>> {
    return this.gradesService.findAll(queryGradeDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GradeResponseDto> {
    return this.gradesService.findOne(id);
  }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateGradeDto: UpdateGradeDto,
  // ): Promise<GradeResponseDto> {
  //   return this.gradesService.update(id, updateGradeDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.gradesService.remove(id);
  }
}
