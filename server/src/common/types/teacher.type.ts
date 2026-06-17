import {
  Class,
  Subject,
  Teacher,
} from '../../../prisma/generated/prisma/client';

export type TeacherWithRelations = Omit<Teacher, 'password'> & {
  subjects?: Pick<Subject, 'id' | 'name'>[];
  classes?: Pick<Class, 'id' | 'name'>[];
};
