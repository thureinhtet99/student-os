import type { AcademicYearModel } from '../../../prisma/generated/prisma/models/AcademicYear.js';
import type { ClassModel } from '../../../prisma/generated/prisma/models/Class.js';

export type ClassWithRelations = ClassModel & {
  academicYear?: AcademicYearModel | null;
};
