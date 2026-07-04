import { StudentResponseDto } from '../../modules/students/dto/student-response.dto.js';
import { StudentWithRelations } from '../types/student.type.js';

export function formatStudent(
  student: StudentWithRelations,
): StudentResponseDto {
  return {
    id: student.user.id,
    name: student.user.name,
    email: student.user.email,
    studentId: student.studentNumber,
    image: student.user.image,
    parent: student.parents?.[0]?.parent ?? null,
    class: student.enrollments?.[0]?.class ?? null,
    setPasswordToken: student.user.setPasswordToken,
    setPasswordTokenExpires:
      student.user.setPasswordTokenExpires?.toISOString() ?? null,
    resetPasswordToken: student.user.resetPasswordToken,
    resetPasswordTokenExpires:
      student.user.resetPasswordTokenExpires?.toISOString() ?? null,
    lastLoginAt: student.user.lastLoginAt,
  };
}
