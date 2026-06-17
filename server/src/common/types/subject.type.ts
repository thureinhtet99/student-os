import { Class, Subject, Teacher } from '../../../prisma/generated/prisma/client.js';

export type SubjectWithRelations = Subject & {
  class?: Pick<Class, 'id' | 'name'> | null;
  teachers?: Pick<Teacher, 'id' | 'name'>[];
};
