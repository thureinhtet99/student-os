import {
  Class,
  Subject,
  Teacher,
  TeachingAssignment,
  User,
} from '../../../prisma/generated/prisma/client.js';

export type TeacherWithRelations = Teacher & {
  user: User;
  teachingAssignments: (TeachingAssignment & {
    class: Class;
    subject: Subject;
  })[];
};
