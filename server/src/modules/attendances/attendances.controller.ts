// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
// } from '@nestjs/common';
// import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Roles } from '@thallesp/nestjs-better-auth';
// import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
// import {
//   ApiPaginatedResponse,
//   PaginatedResponseDto,
// } from '../../common/dto/paginated-response.dto.js';
// import { AttendancesService } from './attendances.service.js';
// import { AttendanceResponseDto } from './dto/attendance-response.dto.js';
// import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
// import { QueryAttendanceDto } from './dto/query-attendance-dto.js';
// import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';

// @ApiTags('Attendances')
// @Roles(TEACHING_ROLES)
// @Controller('attendances')
// export class AttendancesController {
//   constructor(private readonly attendancesService: AttendancesService) {}

//   @ApiOperation({ summary: 'Create attendance record' })
//   @ApiOkResponse({ type: AttendanceResponseDto })
//   @Post()
//   async create(
//     @Body() createAttendanceDto: CreateAttendanceDto,
//   ): Promise<AttendanceResponseDto> {
//     return this.attendancesService.create(createAttendanceDto);
//   }

//   @ApiOperation({ summary: 'List attendance records' })
//   @ApiPaginatedResponse(AttendanceResponseDto)
//   @Get()
//   async findAll(
//     @Query() queryAttendanceDto: QueryAttendanceDto,
//   ): Promise<PaginatedResponseDto<AttendanceResponseDto>> {
//     return this.attendancesService.findAll(queryAttendanceDto);
//   }

//   @ApiOperation({ summary: 'Get attendance by id' })
//   @ApiOkResponse({ type: AttendanceResponseDto })
//   @Get(':id')
//   async findOne(@Param('id') id: string): Promise<AttendanceResponseDto> {
//     return this.attendancesService.findOne(id);
//   }

//   @ApiOperation({ summary: 'Update attendance record' })
//   @ApiOkResponse({ type: AttendanceResponseDto })
//   @Patch(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() updateAttendanceDto: UpdateAttendanceDto,
//   ): Promise<AttendanceResponseDto> {
//     return this.attendancesService.update(id, updateAttendanceDto);
//   }

//   @ApiOperation({ summary: 'Delete attendance record' })
//   @ApiOkResponse({
//     schema: { example: { message: 'Attendance deleted successfully' } },
//   })
//   @Delete(':id')
//   async remove(@Param('id') id: string): Promise<{ message: string }> {
//     return this.attendancesService.remove(id);
//   }
// }
