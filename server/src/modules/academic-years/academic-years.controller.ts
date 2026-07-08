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
import { Roles } from '@thallesp/nestjs-better-auth';
import { ADMIN_ROLES } from '../../common/constants/role.constant.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto.js';
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
  @ApiOkResponse({ type: AcademicYearResponseDto })
  @Post()
  async create(
    @Body() createAcademicYearDto: CreateAcademicYearDto,
  ): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.create(createAcademicYearDto);
  }

  @ApiOperation({ summary: 'List academic years' })
  @ApiPaginatedResponse(AcademicYearResponseDto)
  @Get()
  async findAll(
    @Query() queryAcademicYearDto: QueryAcademicYearDto,
  ): Promise<PaginatedResponseDto<AcademicYearResponseDto>> {
    return this.academicYearsService.findAll(queryAcademicYearDto);
  }

  @ApiOperation({ summary: 'Get current academic year' })
  @ApiOkResponse({ type: AcademicYearResponseDto })
  @Get('current')
  async getCurrent(): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.getCurrent();
  }

  @ApiOperation({ summary: 'Get academic year by id' })
  @ApiOkResponse({ type: AcademicYearResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.findOne(id);
  }

  @ApiOperation({ summary: 'Mark an academic year as the current one' })
  @ApiOkResponse({ type: AcademicYearResponseDto })
  @Patch(':id/set-current')
  async setCurrent(@Param('id') id: string): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.setCurrent(id);
  }

  @ApiOperation({ summary: 'Update academic year' })
  @ApiOkResponse({ type: AcademicYearResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAcademicYearDto: UpdateAcademicYearDto,
  ): Promise<AcademicYearResponseDto> {
    return this.academicYearsService.update(id, updateAcademicYearDto);
  }

  @ApiOperation({ summary: 'Delete academic year' })
  @ApiOkResponse({
    schema: { example: { message: 'Academic year deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.academicYearsService.remove(id);
  }
}
