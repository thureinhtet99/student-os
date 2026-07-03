import { StudentResponseDto } from '../../modules/students/dto/student-response.dto.js';
import { StudentWithRelations } from '../types/student.type.js';

export function formatStudent(
  student: StudentWithRelations,
): StudentResponseDto {
  return {
    id: student.id,
    name: student.user.name,
    email: student.user.email,
    userId: student.user.id,
    studentId: student.studentNumber,
    phone: student.phone,
    address: student.address,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    image: student.user.image,
    parent: student.parents?.[0]?.parent ?? null,
    class: student.enrollments?.[0]?.class ?? null,
    createdAt: student.user.createdAt,
    updatedAt: student.user.updatedAt,
  };
}
