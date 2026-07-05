import { Prisma } from '../../../prisma/generated/prisma/client';

export type AnnouncementWithClass = Prisma.AnnouncementGetPayload<{
  include: { class: true };
}>;
