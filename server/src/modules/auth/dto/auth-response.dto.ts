import { UserRole } from '../../../../prisma/generated/prisma/client.js';

export class SessionResponseDto {
  user!: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string | null;
  };

  session!: {
    id: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

export class AccountsResponseDto {
  accounts!: Array<{
    id: string;
    providerId: string;
    accountId: string;
    createdAt: Date;
  }>;
}
