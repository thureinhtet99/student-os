import {
  Class,
  Subject,
  Teacher,
} from '../../../prisma/generated/prisma/client.js';

export type SubjectWithRelations = Subject & {
  class: Class | null;
  teachers: Teacher[];
};
