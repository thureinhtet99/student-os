import { TeacherResponseDto } from '../../modules/teachers/dto/teacher-response.dto.js';
import { TeacherWithRelations } from '../types/teacher.type.js';
import { resolveTeachingAllocation } from '../utils/teaching-allocation.util.js';

export function formatTeacher(
  teacher: TeacherWithRelations,
  academicYearId?: string | null,
): TeacherResponseDto {
  const allocation = resolveTeachingAllocation(
    teacher.teachingAllocations,
    academicYearId,
  );

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
    class: allocation?.class ? { name: allocation.class.name } : null,
    subject: allocation?.subject ? { name: allocation.subject.name } : null,
    academicYearId: allocation?.academicYearId ?? null,
    lastLoginAt: teacher.user.lastLoginAt,
  };
}
