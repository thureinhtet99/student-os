import { TeacherResponseDto } from '../../modules/teachers/dto/teacher-response.dto.js';
import { TeacherWithRelations } from '../types/teacher.type.js';

export function formatTeacher(
  teacher: TeacherWithRelations,
): TeacherResponseDto {
  return {
    id: teacher.id,
    userId: teacher.user.id,
    teacherId: teacher.teacherId,
    name: teacher.name,
    email: teacher.user.email,
    phone: teacher.phone,
    address: teacher.address,
    gender: teacher.gender,
    dateOfBirth: teacher.dateOfBirth,
    image: teacher.image,
    classes: teacher.classes.map((c) => ({ id: c.id, name: c.name })),
    subjects: teacher.subjects.map((s) => ({ id: s.id, name: s.name })),
    createdAt: teacher.user.createdAt,
    updatedAt: teacher.user.updatedAt,
  };
}
