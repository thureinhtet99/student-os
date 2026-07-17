import { TeacherWithRelations } from '../types/teacher.type.js';

export function resolveTeachingAllocation(
  allocations: TeacherWithRelations['teachingAllocations'],
  academicYearId?: string | null,
) {
  if (!academicYearId) return null;

  return (
    allocations.find(
      (allocation) => allocation.academicYearId === academicYearId,
    ) ?? null
  );
}
