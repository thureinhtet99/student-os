import { Prisma } from '../../../prisma/generated/prisma/client';

export type Exam = Prisma.ExamGetPayload<{
  include: {
    teachingAllocation: false;
    academicYear: false;
    results: false;
  };
}>;
