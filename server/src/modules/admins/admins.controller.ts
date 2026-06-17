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
import { AdminsService } from './admins.service.js';
import { AdminResponseDto } from './dto/admin-response.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { QueryAdminDto } from './dto/query-admin-dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  async create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  async findAll(
    @Query() queryAdminDto: QueryAdminDto,
  ): Promise<PaginatedResponseDto<AdminResponseDto>> {
    return this.adminsService.findAll(queryAdminDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.adminsService.remove(id);
  }
}
