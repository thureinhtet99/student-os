import {
  Assignment,
  Exam,
  Result,
  Student,
} from '../../../prisma/generated/prisma/client.js';

export type ResultWithRelations = Result & {
  exam?: Pick<Exam, 'id' | 'name'> | null;
  assignment?: Pick<Assignment, 'id' | 'name'> | null;
  student?: Pick<Student, 'id' | 'name'> | null;
};
