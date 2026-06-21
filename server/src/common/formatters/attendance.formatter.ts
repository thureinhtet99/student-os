import { AttendanceResponseDto } from '../../modules/attendances/dto/attendance-response.dto.js';
import { AttendanceWithRelations } from '../types/attendance.type.js';

export function formatAttendance(
  attendance: AttendanceWithRelations,
): AttendanceResponseDto {
  return {
    id: attendance.id,
    present: attendance.present,
    date: attendance.date,
    student: attendance.student
      ? { id: attendance.student.id, name: attendance.student.name }
      : null,
    createdAt: attendance.createdAt,
    updatedAt: attendance.updatedAt,
  };
}
