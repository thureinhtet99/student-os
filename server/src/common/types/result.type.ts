import {
  Assignment,
  Exam,
  Result,
  Student,
} from '../../../prisma/generated/prisma/client.js';

export type ResultWithRelations = Result & {
  exam: Exam | null;
  assignment: Assignment | null;
  student: Student | null;
};
