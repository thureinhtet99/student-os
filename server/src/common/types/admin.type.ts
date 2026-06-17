import { Admin } from '../../../prisma/generated/prisma/client';

export type AdminWithRelations = Omit<Admin, 'password'>;
