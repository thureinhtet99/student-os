import { TeacherResponseDto } from '../../modules/teachers/dto/teacher-response.dto.js';
import { TeacherWithRelations } from '../types/teacher.type.js';

export function formatTeacher(
  teacher: TeacherWithRelations,
): TeacherResponseDto {
  const firstAllocation = teacher.teachingAllocations?.[0];

  return {
    id: teacher.id,
    userId: teacher.user.id,
    name: teacher.user.name,
    email: teacher.user.email,
    employeeCode: teacher.employeeCode,
    image: teacher.user.image ?? null,
    phone: teacher.phone,
    address: teacher.address,
    gender: teacher.gender,
    dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.toISOString() : null,
    classId: firstAllocation?.classId ?? null,
    subjectId: firstAllocation?.subjectId ?? null,
    academicYearId: firstAllocation?.academicYearId,
    teachingAllocations: teacher.teachingAllocations.map((ta) => ({
      id: ta.id,
      teacherId: ta.teacherId,
      subjectId: ta.subjectId,
      classId: ta.classId,
      academicYearId: ta.academicYearId,
    })),
    setPasswordToken: teacher.user.setPasswordToken,
    setPasswordTokenExpires: teacher.user.setPasswordTokenExpires ?? null,
    resetPasswordToken: teacher.user.resetPasswordToken,
    resetPasswordTokenExpires: teacher.user.resetPasswordTokenExpires ?? null,
    lastLoginAt: teacher.user.lastLoginAt,
  };
}
