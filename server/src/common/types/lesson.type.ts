import { Lesson, Subject } from '../../../prisma/generated/prisma/client.js';

export type LessonWithRelations = Lesson & {
  subject?: Pick<Subject, 'id' | 'name'> | null;
};
