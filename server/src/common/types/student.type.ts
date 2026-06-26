import {
  Class,
  Parent,
  Student,
  User,
} from '../../../prisma/generated/prisma/client.js';

export type StudentWithRelations = Omit<Student, 'password'> & {
  user: User;
  class: Class | null;
  parent: Parent | null;
};
