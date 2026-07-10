import { TeacherResponseDto } from '../../modules/teachers/dto/teacher-response.dto.js';
import { TeacherWithRelations } from '../types/teacher.type.js';

export function formatTeacher(
  teacher: TeacherWithRelations,
): TeacherResponseDto {
  return {
    id: teacher.user.id,
    teacherId: teacher.employeeCode,
    name: teacher.user.name,
    email: teacher.user.email,
    image: teacher.user.image ?? null,
    teachingAllocations: teacher.teachingAllocations.map((ta) => ({
      id: ta.id,
      classId: ta.classId,
      subjectId: ta.subjectId,
    })),
    setPasswordToken: teacher.user.setPasswordToken,
    setPasswordTokenExpires: teacher.user.setPasswordTokenExpires ?? null,
    resetPasswordToken: teacher.user.resetPasswordToken,
    resetPasswordTokenExpires: teacher.user.resetPasswordTokenExpires ?? null,
    lastLoginAt: teacher.user.lastLoginAt,
  };
}
