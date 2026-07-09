// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Prisma } from '../../../prisma/generated/prisma/client.js';
// import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
// import { PrismaService } from '../../database/prisma/prisma.service.js';
// import { AttendanceResponseDto } from './dto/attendance-response.dto.js';
// import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
// import { QueryAttendanceDto } from './dto/query-attendance-dto.js';
// import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';

// @Injectable()
// export class AttendancesService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(
//     createAttendanceDto: CreateAttendanceDto,
//   ): Promise<AttendanceResponseDto> {
//     const attendance = await this.prisma.attendance.create({
//       data: {
//         present: createAttendanceDto.present,
//         date: new Date(createAttendanceDto.date),
//         enrollmentId: createAttendanceDto.enrollmentId,
//         academicYearId: createAttendanceDto.academicYearId,
//       },
//     });

//     return attendance;
//   }

//   async findAll(
//     queryAttendanceDto: QueryAttendanceDto,
//   ): Promise<PaginatedResponseDto<AttendanceResponseDto>> {
//     const {
//       enrollmentId,
//       academicYearId,
//       present,
//       page = 1,
//       limit = 10,
//     } = queryAttendanceDto;

//     const where: Prisma.AttendanceWhereInput = {};

//     if (enrollmentId) where.enrollmentId = enrollmentId;
//     if (academicYearId) where.academicYearId = academicYearId;
//     if (present !== undefined) where.present = present;

//     const total = await this.prisma.attendance.count({ where });

//     const attendances = await this.prisma.attendance.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { date: 'desc' },
//     });

//     return {
//       data: attendances,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   async findOne(id: string): Promise<AttendanceResponseDto> {
//     const attendance = await this.prisma.attendance.findUnique({
//       where: { id },
//     });

//     if (!attendance) throw new NotFoundException('Attendance is not found');

//     return attendance;
//   }

//   async update(
//     id: string,
//     updateAttendanceDto: UpdateAttendanceDto,
//   ): Promise<AttendanceResponseDto> {
//     const existingAttendance = await this.prisma.attendance.findUnique({
//       where: { id },
//     });
//     if (!existingAttendance)
//       throw new NotFoundException('Attendance is not found');

//     return await this.prisma.attendance.update({
//       where: { id },
//       data: {
//         present: updateAttendanceDto.present,
//         date: updateAttendanceDto.date
//           ? new Date(updateAttendanceDto.date)
//           : undefined,
//         enrollmentId: updateAttendanceDto.enrollmentId,
//         academicYearId: updateAttendanceDto.academicYearId,
//       },
//     });
//   }

//   async remove(id: string): Promise<{ message: string }> {
//     const existingAttendance = await this.prisma.attendance.findUnique({
//       where: { id },
//     });
//     if (!existingAttendance)
//       throw new NotFoundException('Attendance is not found');

//     await this.prisma.attendance.delete({ where: { id } });

//     return { message: 'Attendance deleted successfully' };
//   }
// }
