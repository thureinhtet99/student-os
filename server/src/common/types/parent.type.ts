import { Parent, ParentStudent, Student, User } from '../../../prisma/generated/prisma/client.js';

export type ParentWithRelations = Parent & {
  students:
    | (ParentStudent & {
        student: Student & {
          user: User;
        };
      })[]
    | null;
};
