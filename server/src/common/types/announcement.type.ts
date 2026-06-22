import {
  Announcement,
  Class,
} from '../../../prisma/generated/prisma/client.js';

export type AnnouncementWithRelations = Announcement & {
  class: Class | null;
};
