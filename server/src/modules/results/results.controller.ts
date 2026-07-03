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
import { CreateResultDto } from './dto/create-result.dto.js';
import { QueryResultDto } from './dto/query-result-dto.js';
import { ResultResponseDto } from './dto/result-response.dto.js';
import { UpdateResultDto } from './dto/update-result.dto.js';
import { ResultsService } from './results.service.js';

@ApiTags('Results')
@Roles(TEACHING_ROLES)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @ApiOperation({ summary: 'Create result' })
  @ApiResponse({ status: 201, type: ResultResponseDto })
  @Post()
  async create(
    @Body() createResultDto: CreateResultDto,
  ): Promise<ResultResponseDto> {
    return this.resultsService.create(createResultDto);
  }

  @ApiOperation({ summary: 'List results' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  @Get()
  async findAll(
    @Query() queryResultDto: QueryResultDto,
  ): Promise<PaginatedResponseDto<ResultResponseDto>> {
    return this.resultsService.findAll(queryResultDto);
  }

  @ApiOperation({ summary: 'Get result by id' })
  @ApiResponse({ status: 200, type: ResultResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResultResponseDto> {
    return this.resultsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update result' })
  @ApiResponse({ status: 200, type: ResultResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResultDto: UpdateResultDto,
  ): Promise<ResultResponseDto> {
    return this.resultsService.update(id, updateResultDto);
  }

  @ApiOperation({ summary: 'Delete result' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Result deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.resultsService.remove(id);
  }
}
