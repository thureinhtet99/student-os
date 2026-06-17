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
import { CreateParentDto } from './dto/create-parent.dto.js';
import { ParentResponseDto } from './dto/parent-response.dto.js';
import { QueryParentDto } from './dto/query-parent-dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { ParentsService } from './parents.service.js';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  async create(
    @Body() createParentDto: CreateParentDto,
  ): Promise<ParentResponseDto> {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  async findAll(
    @Query() queryParentDto: QueryParentDto,
  ): Promise<PaginatedResponseDto<ParentResponseDto>> {
    return this.parentsService.findAll(queryParentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ParentResponseDto> {
    return this.parentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
  ): Promise<ParentResponseDto> {
    return this.parentsService.update(id, updateParentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.parentsService.remove(id);
  }
}
