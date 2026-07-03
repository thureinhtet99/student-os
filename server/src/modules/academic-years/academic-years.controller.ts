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
import { ADMIN_ROLES } from '../../common/constants/role.constant.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { AcademicYearsService } from './academic-years.service.js';
import { AcademicYearResponseDto } from './dto/academic-year-response.dto.js';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto.js';
import { QueryAcademicYearDto } from './dto/query-academic-year.dto.js';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto.js';

@ApiTags('Academic Years')
@Roles(ADMIN_ROLES)
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @ApiOperation({ summary: 'Create academic year' })
  @ApiResponse({ status: 201, type: AcademicYearResponseDto })
  @Post()
  create(
    @Body() createAcademicYearDto: CreateAcademicYearDto,
  ): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.create(createAcademicYearDto);
  }

  @ApiOperation({ summary: 'List academic years' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  @Get()
  findAll(
    @Query() queryAcademicYearDto: QueryAcademicYearDto,
  ): Promise<PaginatedResponseDto<AcademicYearResponseDto>> {
    return this.academicYearsService.findAll(queryAcademicYearDto);
  }

  @ApiOperation({ summary: 'Get academic year by id' })
  @ApiResponse({ status: 200, type: AcademicYearResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update academic year' })
  @ApiResponse({ status: 200, type: AcademicYearResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAcademicYearDto: UpdateAcademicYearDto,
  ): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.update(id, updateAcademicYearDto);
  }

  @ApiOperation({ summary: 'Delete academic year' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Academic year deleted successfully' } },
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.academicYearsService.remove(id);
  }
}
