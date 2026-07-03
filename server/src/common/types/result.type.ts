import type { AcademicYearModel } from '../../../prisma/generated/prisma/models/AcademicYear.js';
import type { EnrollmentModel } from '../../../prisma/generated/prisma/models/Enrollment.js';
import type { ExamModel } from '../../../prisma/generated/prisma/models/Exam.js';
import type { ResultModel } from '../../../prisma/generated/prisma/models/Result.js';

export type ResultWithRelations = ResultModel & {
  exam?: ExamModel | null;
  enrollment?: EnrollmentModel | null;
  academicYear?: AcademicYearModel | null;
};
