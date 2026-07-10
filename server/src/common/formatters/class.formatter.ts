import { ClassResponseDto } from '../../modules/classes/dto/class-response-dto.js';
import { ClassWithAcademicYear } from '../types/class.type.js';

export function formatClass(
  classItem: ClassWithAcademicYear,
): ClassResponseDto {
  return {
    id: classItem.id,
    name: classItem.name,
    // academicYearId: classItem.academicYearId,
    // academicYearName: classItem.academicYear.name,
    // createdAt: classItem.createdAt,
    // updatedAt: classItem.updatedAt,
  };
}
