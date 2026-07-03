import { AttendanceResponseDto } from '../../modules/attendances/dto/attendance-response.dto.js';
import { AttendanceWithRelations } from '../types/attendance.type.js';

export function formatAttendance(
  attendance: AttendanceWithRelations,
): AttendanceResponseDto {
  return {
    id: attendance.id,
    present: attendance.present,
    date: attendance.date,
    enrollmentId: attendance.enrollmentId,
    academicYearId: attendance.academicYearId,
    createdAt: attendance.createdAt,
  };
}
