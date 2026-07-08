import { Prisma } from '../../../prisma/generated/prisma/client';

export type Exam = Prisma.ExamGetPayload<{
  include: {
    teachingAssignment: false;
    academicYear: false;
    results: false;
  };
}>;
