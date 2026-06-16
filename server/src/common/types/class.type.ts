import { Class, Teacher } from '../../../prisma/generated/prisma/client';

export type ClassWithRelations = Class & {
  teacher: Pick<Teacher, 'id' | 'name'> | null;
  // students: Omit<Student, 'password'>[];
  // subjects: Omit<Subject, 'createdAt' | 'updatedAt'>[];
  // events: Omit<Event, 'createdAt' | 'updatedAt'>[];
  // announcements: Omit<Announcement, 'createdAt' | 'updatedAt'>[];
};
