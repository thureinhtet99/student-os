import {
  Class,
  Subject,
  Teacher,
  User,
} from '../../../prisma/generated/prisma/client.js';

export type TeacherWithRelations = Teacher & {
  user: User;
  classes: Pick<Class, 'id' | 'name'>[];
  subjects: Pick<Subject, 'id' | 'name'>[];
};
