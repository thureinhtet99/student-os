import {
  Class,
  Enrollment,
  Parent,
  ParentStudent,
  Student,
  User,
} from '../../../prisma/generated/prisma/client.js';

export type StudentWithRelations = Omit<Student, 'password'> & {
  user: User;
  enrollments: (Enrollment & {
    class: Pick<Class, 'id'>;
  })[];
  parents: (ParentStudent & {
    parent: Pick<Parent, 'id'>;
  })[];
};
