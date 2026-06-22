import { Class, Event } from '../../../prisma/generated/prisma/client.js';

export type EventWithRelations = Event & {
  class: Class | null;
};
