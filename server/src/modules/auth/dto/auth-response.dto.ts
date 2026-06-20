import { UserRole } from '../../../../prisma/generated/prisma/client';

export class AuthResponseDto {
  access_token!: string;

  refresh_token!: string;

  user!: {
    id: string;
    email: string;
    role: UserRole;
  };
}
