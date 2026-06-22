import { StudentResponseDto } from '../../modules/students/dto/student-response.dto.js';
import { StudentWithRelations } from '../types/student.type.js';
import { formatParent } from './parent.formatter.js';

export function formatStudent(
  student: StudentWithRelations,
): StudentResponseDto {
  return {
    id: student.id,
    name: student.name,
    email: student.user.email,
    userId: student.user.id,
    studentId: student.studentId,
    phone: student.phone,
    address: student.address,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    image: student.image,
    parent: student.parent ? formatParent(student.parent) : null,
    class: student.class
      ? { id: student.class.id, name: student.class.name }
      : null,
    grade: student.grade
      ? { id: student.grade.id, level: student.grade.level }
      : null,
    createdAt: student.user.createdAt,
    updatedAt: student.user.updatedAt,
  };
}
