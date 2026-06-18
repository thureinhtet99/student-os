import { Exam, Subject } from '../../../prisma/generated/prisma/client.js';

export type ExamWithRelations = Exam & {
  subject?: Pick<Subject, 'id' | 'name'> | null;
};
