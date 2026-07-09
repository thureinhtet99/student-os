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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto.js';
import { ADMIN_ROLES } from '../../common/constants/role.constant.js';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { ParentResponseDto } from './dto/parent-response.dto.js';
import { QueryParentDto } from './dto/query-parent-dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { ParentsService } from './parents.service.js';

@ApiTags('Parents')
@Roles(ADMIN_ROLES)
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @ApiOperation({ summary: 'Create a parent' })
  @ApiOkResponse({ type: ParentResponseDto })
  @Post()
  async create(
    @Body() createParentDto: CreateParentDto,
  ): Promise<ParentResponseDto> {
    return this.parentsService.create(createParentDto);
  }

  @ApiOperation({ summary: 'List parents' })
  @ApiPaginatedResponse(ParentResponseDto)
  @Get()
  async findAll(
    @Query() queryParentDto: QueryParentDto,
  ): Promise<PaginatedResponseDto<ParentResponseDto>> {
    return this.parentsService.findAll(queryParentDto);
  }

  @ApiOperation({ summary: 'Get a parent by id' })
  @ApiOkResponse({ type: ParentResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ParentResponseDto> {
    return this.parentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a parent' })
  @ApiOkResponse({ type: ParentResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
  ): Promise<ParentResponseDto> {
    return this.parentsService.update(id, updateParentDto);
  }

  @ApiOperation({ summary: 'Delete a parent' })
  @ApiOkResponse({
    schema: { example: { message: 'Parent deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.parentsService.remove(id);
  }
}
