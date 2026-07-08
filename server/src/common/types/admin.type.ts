import { Prisma } from '../../../prisma/generated/prisma/client';

export type AdminWithUser = Prisma.AdminGetPayload<{
  include: { user: true };
}>;
