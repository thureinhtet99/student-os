import {
  Class,
  Subject,
  Teacher,
  TeachingAllocation,
  User,
} from '../../../prisma/generated/prisma/client.js';

export type TeacherWithRelations = Teacher & {
  user: User;
  teachingAllocations: (TeachingAllocation & {
    class: Class;
    subject: Subject;
  })[];
};
