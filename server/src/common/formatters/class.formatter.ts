import { ClassResponseDto } from '../../modules/classes/dto/class-response-dto.js';
import { ClassWithRelations } from '../types/class.type';

export function formatClass(classEntity: ClassWithRelations): ClassResponseDto {
  return {
    id: classEntity.id,
    name: classEntity.name,
    academicYear: classEntity.academicYear ?? null,
    academicYearId: classEntity.academicYearId,
    academicYearName: classEntity.academicYear?.name ?? null,
    createdAt: null,
    updatedAt: null,
  };
}
