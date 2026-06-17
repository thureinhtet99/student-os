import { TeacherResponseDto } from '../../modules/teachers/dto/teacher-response.dto.js';
import { TeacherWithRelations } from '../types/teacher.type.js';

export function formatTeacher(teacher: TeacherWithRelations): TeacherResponseDto {
  return {
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone,
    address: teacher.address,
    gender: teacher.gender,
    birthday: teacher.birthday,
    image: teacher.image,
    role: teacher.role,
    classes: teacher.classes.map((c) => ({ id: c.id, name: c.name })),
    subjects: teacher.subjects.map((s) => ({ id: s.id, name: s.name })),
    created_at: teacher.createdAt,
    updated_at: teacher.updatedAt,
  };
}
