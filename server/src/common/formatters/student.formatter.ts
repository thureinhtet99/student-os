import { StudentResponseDto } from '../../modules/students/dto/student-response.dto.js';
import { StudentWithRelations } from '../types/student.type.js';

export function formatStudent(
  student: StudentWithRelations,
): StudentResponseDto {
  return {
    id: student.user.id,
    name: student.user.name,
    email: student.user.email,
    studentNumber: student.studentNumber,
    image: student.user.image,
    phone: student.phone,
    address: student.address,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString() : null,
    parentId: student.parents?.[0]?.parent?.id ?? null,
    classId: student.enrollments?.[0]?.class?.id ?? null,
    setPasswordToken: student.user.setPasswordToken,
    setPasswordTokenExpires: student.user.setPasswordTokenExpires ?? null,
    resetPasswordToken: student.user.resetPasswordToken,
    resetPasswordTokenExpires: student.user.resetPasswordTokenExpires ?? null,
    lastLoginAt: student.user.lastLoginAt,
  };
}
