import {
  Class,
  Grade,
  Parent,
  Student,
} from '../../../prisma/generated/prisma/client';

export type StudentWithRelations = Omit<Student, 'password'> & {
  class: Pick<Class, 'id' | 'name'> | null;
  grade: Pick<Grade, 'id' | 'level'> | null;
  parent: Omit<Parent, 'password'> | null;
};
