import { StudentResponseDto } from '../../modules/students/dto/student-response.dto.js';
import { StudentWithRelations } from '../types/student.type.js';
import { formatParent } from './parent.formatter.js';

export function formatStudent(
  student: StudentWithRelations,
): StudentResponseDto {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    address: student.address,
    gender: student.gender,
    birthday: student.birthday,
    image: student.image,
    role: student.role,
    parent: student.parent ? formatParent(student.parent) : null,
    class: student.class
      ? { id: student.class.id, name: student.class.name }
      : null,
    grade: student.grade
      ? { id: student.grade.id, level: student.grade.level }
      : null,
    created_at: student.createdAt ?? null,
    updated_at: student.updatedAt ?? null,
  };
}
