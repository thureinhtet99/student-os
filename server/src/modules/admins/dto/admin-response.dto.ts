import { UserRole } from '../../../../prisma/generated/prisma/client.js';

export class AdminResponseDto {
  id!: string;
  name!: string;
  email!: string;
  role!: UserRole;
  created_at!: Date | null;
  updated_at!: Date | null;
}
