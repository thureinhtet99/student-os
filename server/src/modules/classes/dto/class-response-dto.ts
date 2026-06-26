import {
  Announcement,
  Event,
  Student,
  Subject,
  Teacher,
} from '../../../../prisma/generated/prisma/client';

export class ClassResponseDto {
  id!: string;

  name!: string;

  teacher!: Teacher | null;

  students!: Omit<Student, 'password'>[] | null;

  subjects!: Subject[] | null;

  events!: Event[] | null;

  announcements!: Announcement[] | null;

  createdAt!: Date;

  updatedAt!: Date;
}
