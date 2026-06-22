import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatAttendance } from '../../common/formatters/attendance.formatter.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { AttendanceResponseDto } from './dto/attendance-response.dto.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { QueryAttendanceDto } from './dto/query-attendance-dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceResponseDto> {
    const attendance = await this.prisma.attendance.create({
      data: {
        present: createAttendanceDto.present,
        date: new Date(createAttendanceDto.date),
        student: { connect: { id: createAttendanceDto.student_id } },
      },
      include: { student: true },
    });

    return formatAttendance(attendance);
  }

  async findAll(
    queryAttendanceDto: QueryAttendanceDto,
  ): Promise<PaginatedResponseDto<AttendanceResponseDto>> {
    const { student_id, present, page = 1, limit = 10 } = queryAttendanceDto;

    const where: Prisma.AttendanceWhereInput = {};

    if (student_id) where.studentId = student_id;
    if (present !== undefined) where.present = present;

    const total = await this.prisma.attendance.count({ where });

    const attendances = await this.prisma.attendance.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        student: true,
      },
    });

    return {
      data: attendances.map((att) => formatAttendance(att)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<AttendanceResponseDto> {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!attendance) throw new NotFoundException('Attendance is not found');

    return formatAttendance(attendance);
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceResponseDto> {
    const existingAttendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
    if (!existingAttendance)
      throw new NotFoundException('Attendance is not found');

    const attendance = await this.prisma.attendance.update({
      where: { id },
      data: {
        present: updateAttendanceDto.present,
        date: updateAttendanceDto.date
          ? new Date(updateAttendanceDto.date)
          : undefined,
        student: updateAttendanceDto.student_id
          ? { connect: { id: updateAttendanceDto.student_id } }
          : undefined,
      },
      include: {
        student: true,
      },
    });

    return formatAttendance(attendance);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingAttendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
    if (!existingAttendance)
      throw new NotFoundException('Attendance is not found');

    await this.prisma.attendance.delete({ where: { id } });

    return { message: 'Attendance deleted successfully' };
  }
}
