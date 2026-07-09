import {
  Subject,
  TeachingAllocation,
} from '../../../prisma/generated/prisma/client.js';

export type SubjectWithRelations = Subject & {
  teachingAllocations: TeachingAllocation[];
};
