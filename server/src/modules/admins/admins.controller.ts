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
import { AdminsService } from './admins.service.js';
import { AdminResponseDto } from './dto/admin-response.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { QueryAdminDto } from './dto/query-admin-dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

@ApiTags('Admins')
@Roles(ADMIN_ROLES)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @ApiOperation({ summary: 'Create admin' })
  @ApiOkResponse({ type: AdminResponseDto })
  @Post()
  async create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminsService.create(createAdminDto);
  }

  @ApiOperation({ summary: 'List admins' })
  @ApiPaginatedResponse(AdminResponseDto)
  @Get()
  async findAll(
    @Query() queryAdminDto: QueryAdminDto,
  ): Promise<PaginatedResponseDto<AdminResponseDto>> {
    return this.adminsService.findAll(queryAdminDto);
  }

  @ApiOperation({ summary: 'Get admin by id' })
  @ApiOkResponse({ type: AdminResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update admin' })
  @ApiOkResponse({ type: AdminResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Delete admin' })
  @ApiOkResponse({
    schema: { example: { message: 'Admin deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.adminsService.remove(id);
  }
}
