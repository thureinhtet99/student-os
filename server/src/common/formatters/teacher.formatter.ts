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
    class: firstAllocation?.class ? { name: firstAllocation.class.name } : null,
    subject: firstAllocation?.subject
      ? { name: firstAllocation.subject.name }
      : null,
    academicYearId: firstAllocation?.academicYearId,
    setPasswordToken: teacher.user.setPasswordToken,
    setPasswordTokenExpires: teacher.user.setPasswordTokenExpires ?? null,
    resetPasswordToken: teacher.user.resetPasswordToken,
    resetPasswordTokenExpires: teacher.user.resetPasswordTokenExpires ?? null,
    lastLoginAt: teacher.user.lastLoginAt,
  };
}
