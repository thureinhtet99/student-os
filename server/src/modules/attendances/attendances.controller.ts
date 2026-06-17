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
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { QueryAttendanceDto } from './dto/query-attendance-dto.js';
import { AttendanceResponseDto } from './dto/attendance-response.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { AttendancesService } from './attendances.service.js';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<AttendanceResponseDto> {
    return this.attendancesService.create(createAttendanceDto);
  }

  @Get()
  async findAll(@Query() queryAttendanceDto: QueryAttendanceDto): Promise<PaginatedResponseDto<AttendanceResponseDto>> {
    return this.attendancesService.findAll(queryAttendanceDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AttendanceResponseDto> {
    return this.attendancesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto): Promise<AttendanceResponseDto> {
    return this.attendancesService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.attendancesService.remove(id);
  }
}
