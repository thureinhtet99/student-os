import { StudentResponseDto } from '../../modules/students/dto/student-response.dto.js';
import { StudentWithRelations } from '../types/student.type.js';

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
    parent: student.parent ?? null,
    class: student.class ?? null,
    createdAt: student.user.createdAt,
    updatedAt: student.user.updatedAt,
  };
}
