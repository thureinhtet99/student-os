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
import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
import { CreateResultDto } from './dto/create-result.dto.js';
import { QueryResultDto } from './dto/query-result-dto.js';
import { ResultResponseDto } from './dto/result-response.dto.js';
import { UpdateResultDto } from './dto/update-result.dto.js';
import { ResultsService } from './results.service.js';

@Roles(TEACHING_ROLES)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  async create(
    @Body() createResultDto: CreateResultDto,
  ): Promise<ResultResponseDto> {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  async findAll(
    @Query() queryResultDto: QueryResultDto,
  ): Promise<PaginatedResponseDto<ResultResponseDto>> {
    return this.resultsService.findAll(queryResultDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResultResponseDto> {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResultDto: UpdateResultDto,
  ): Promise<ResultResponseDto> {
    return this.resultsService.update(id, updateResultDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.resultsService.remove(id);
  }
}
