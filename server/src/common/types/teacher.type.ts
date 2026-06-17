import { Class, Subject, Teacher } from '../../../prisma/generated/prisma/client.js';

export type TeacherWithRelations = Omit<Teacher, 'password'> & {
  classes: Pick<Class, 'id' | 'name'>[];
  subjects: Pick<Subject, 'id' | 'name'>[];
};
