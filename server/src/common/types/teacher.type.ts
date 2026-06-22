import {
  Class,
  Subject,
  Teacher,
  User,
} from '../../../prisma/generated/prisma/client.js';

export type TeacherWithRelations = Omit<Teacher, 'password'> & {
  user: User;
  classes: Class[];
  subjects: Subject[];
};
