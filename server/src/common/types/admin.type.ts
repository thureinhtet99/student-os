import { Admin, User } from '../../../prisma/generated/prisma/client.js';

export type AdminWithRelations = Admin & {
  user: User;
};
