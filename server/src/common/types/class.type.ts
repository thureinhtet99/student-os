import { Prisma } from '../../../prisma/generated/prisma/client';

export type ClassWithAcademicYear = Prisma.ClassGetPayload<{
  include: { academicYear: true };
}>;
