import { TeacherResponseDto } from '../../modules/teachers/dto/teacher-response.dto.js';
import { TeacherWithRelations } from '../types/teacher.type.js';

export function formatTeacher(
  teacher: TeacherWithRelations,
): TeacherResponseDto {
  return {
    id: teacher.id,
    userId: teacher.user.id,
    teacherId: teacher.employeeCode,
    name: teacher.user.name,
    email: teacher.user.email,
    phone: teacher.phone,
    address: teacher.address,
    gender: teacher.gender,
    dateOfBirth: teacher.dateOfBirth,
    image: teacher.user.image,
    classes: Array.from(
      new Map(
        teacher.teachingAssignments.map((ta) => [ta.class.id, ta.class]),
      ).values(),
    ).map((c) => ({ id: c.id, name: c.name })),
    subjects: Array.from(
      new Map(
        teacher.teachingAssignments.map((ta) => [ta.subject.id, ta.subject]),
      ).values(),
    ).map((s) => ({ id: s.id, name: s.name })),
    createdAt: teacher.user.createdAt,
    updatedAt: teacher.user.updatedAt,
  };
}
