import {
  Class,
  Grade,
  Parent,
  Student,
  User,
} from '../../../prisma/generated/prisma/client.js';

export type StudentWithRelations = Student & {
  user: User;
  class: Pick<Class, 'id' | 'name'> | null;
  grade: Pick<Grade, 'id' | 'level'> | null;
  parent: Parent | null;
};
