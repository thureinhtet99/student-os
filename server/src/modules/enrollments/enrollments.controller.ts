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
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto.js';
import { QueryEnrollmentDto } from './dto/query-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';
import { EnrollmentsService } from './enrollments.service.js';

@ApiTags('Enrollments')
@Roles(ADMIN_ROLES)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @ApiOperation({ summary: 'Create enrollment' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  @Post()
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @ApiOperation({ summary: 'List enrollments' })
  @ApiPaginatedResponse(EnrollmentResponseDto)
  @Get()
  async findAll(
    @Query() queryEnrollmentDto: QueryEnrollmentDto,
  ): Promise<PaginatedResponseDto<EnrollmentResponseDto>> {
    return this.enrollmentsService.findAll(queryEnrollmentDto);
  }

  @ApiOperation({ summary: 'Get enrollment by id' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update enrollment' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @ApiOperation({ summary: 'Delete enrollment' })
  @ApiOkResponse({
    schema: { example: { message: 'Enrollment deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.enrollmentsService.remove(id);
  }
}
