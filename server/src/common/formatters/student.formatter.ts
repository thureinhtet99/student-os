import {
  Class,
  Grade,
  Parent,
  Student,
} from '../../../prisma/generated/prisma/client.js';
import { StudentResponseDto } from '../../modules/students/dto/student-response.dto.js';
import { formatClass } from './class.formatter.js';
import { formatGrade } from './grade.formatter.js';
import { formatParent } from './parent.formatter.js';

export type StudentWithRelations = Student & {
  class: Class | null;
  grade: Grade | null;
  parent: Omit<Parent, 'password'> | null;
};

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
    class: student.class ? formatClass(student.class) : null,
    grade: student.grade ? formatGrade(student.grade) : null,
    created_at: student.createdAt,
    updated_at: student.updatedAt,
  };
}
