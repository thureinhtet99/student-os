import {
  Announcement,
  Class,
  Student,
  Subject,
  Teacher,
} from '../../../prisma/generated/prisma/client';

export type ClassWithRelations = Class & {
  teacher: Teacher | null;
  students: Omit<Student, 'password'>[];
  subjects: Subject[] | null;
  events: Event[] | null;
  announcements: Announcement[] | null;
};
