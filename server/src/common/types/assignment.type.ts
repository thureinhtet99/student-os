import {
  Assignment,
  Subject,
} from '../../../prisma/generated/prisma/client.js';

export type AssignmentWithRelations = Assignment & {
  subject?: Pick<Subject, 'id' | 'name'> | null;
};
