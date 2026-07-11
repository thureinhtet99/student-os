import {
  Class,
  Enrollment,
  Student,
  Subject,
  Teacher,
  TeachingAllocation,
  User,
} from '../../../prisma/generated/prisma/client.js';
import { ClassResponseDto } from '../../modules/classes/dto/class-response-dto.js';

type FormatClassType = Class & {
  enrollments?: (Enrollment & { student: Student & { user: User } })[];
  teachingAllocations?: (TeachingAllocation & {
    teacher: Teacher & { user: User };
    subject: Subject;
  })[];
};

export function formatClass(
  classItem: FormatClassType,
  academicYear?: { id: string; name: string } | null,
): ClassResponseDto {
  const response: ClassResponseDto = {
    id: classItem.id,
    name: classItem.name,
  };

  if (academicYear) {
    response.academicYear = {
      id: academicYear.id,
      name: academicYear.name,
    };
  }

  if (classItem.enrollments) {
    response.enrollments = classItem.enrollments.map((e) => ({
      id: e.id,
      student: {
        id: e.student.id,
        name: e.student.user.name,
      },
    }));
  }

  if (classItem.teachingAllocations) {
    response.teachingAllocations = classItem.teachingAllocations.map((ta) => ({
      id: ta.id,
      teacher: {
        id: ta.teacher.id,
        name: ta.teacher.user.name,
      },
      subject: {
        id: ta.subject.id,
        name: ta.subject.name,
      },
      class: {
        id: classItem.id,
        name: classItem.name,
      },
    }));
  }

  return response;
}
