import { Prisma } from '../../../prisma/generated/prisma/client';

export type Result = Prisma.ResultGetPayload<{
  include: {
    enrollment: false;
    academicYear: false;
    exam: false;
  };
}>;
