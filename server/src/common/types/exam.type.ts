import type { ExamModel } from '../../../prisma/generated/prisma/models/Exam.js';
import type { TeachingAssignmentModel } from '../../../prisma/generated/prisma/models/TeachingAssignment.js';

export type ExamWithRelations = ExamModel & {
  teachingAssignment?: TeachingAssignmentModel | null;
};
