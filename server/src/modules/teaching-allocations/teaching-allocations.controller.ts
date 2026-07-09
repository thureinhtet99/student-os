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
import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto.js';
import { CreateTeachingAllocationDto } from './dto/create-teaching-allocation.dto.js';
import { QueryTeachingAllocationDto } from './dto/query-teaching-allocation.dto.js';
import { TeachingAllocationResponseDto } from './dto/teaching-allocation-response.dto.js';
import { UpdateTeachingAllocationDto } from './dto/update-teaching-allocation.dto.js';
import { TeachingAllocationsService } from './teaching-allocations.service.js';

@ApiTags('Teaching Allocations')
@Roles(TEACHING_ROLES)
@Controller('teaching-Allocations')
export class TeachingAllocationsController {
  constructor(
    private readonly teachingAllocationService: TeachingAllocationsService,
  ) {}

  @ApiOperation({ summary: 'Create teaching Allocation' })
  @ApiOkResponse({ type: TeachingAllocationResponseDto })
  @Post()
  create(
    @Body() createTeachingAllocationDto: CreateTeachingAllocationDto,
  ): Promise<TeachingAllocationResponseDto> {
    return this.teachingAllocationService.create(createTeachingAllocationDto);
  }

  @ApiOperation({ summary: 'List teaching Allocations' })
  @ApiPaginatedResponse(TeachingAllocationResponseDto)
  @Get()
  findAll(
    @Query() queryTeachingAllocationDto: QueryTeachingAllocationDto,
  ): Promise<PaginatedResponseDto<TeachingAllocationResponseDto>> {
    return this.teachingAllocationService.findAll(queryTeachingAllocationDto);
  }

  @ApiOperation({ summary: 'Get teaching Allocation by id' })
  @ApiOkResponse({ type: TeachingAllocationResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<TeachingAllocationResponseDto> {
    return this.teachingAllocationService.findOne(id);
  }

  @ApiOperation({ summary: 'Update teaching Allocation' })
  @ApiOkResponse({ type: TeachingAllocationResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeachingAllocationDto: UpdateTeachingAllocationDto,
  ): Promise<TeachingAllocationResponseDto> {
    return this.teachingAllocationService.update(
      id,
      updateTeachingAllocationDto,
    );
  }

  @ApiOperation({ summary: 'Delete teaching Allocation' })
  @ApiOkResponse({
    schema: {
      example: { message: 'Teaching Allocation deleted successfully' },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.teachingAllocationService.remove(id);
  }
}
