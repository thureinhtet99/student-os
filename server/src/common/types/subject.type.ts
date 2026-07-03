import {
  Subject,
  TeachingAssignment,
} from '../../../prisma/generated/prisma/client.js';

export type SubjectWithRelations = Subject & {
  teachingAssignments: TeachingAssignment[];
};
