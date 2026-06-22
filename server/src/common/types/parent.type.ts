import { Parent, Student } from '../../../prisma/generated/prisma/client';

export type ParentWithRelations = Omit<Parent, 'password'> & {
  students: Student[] | null;
};
