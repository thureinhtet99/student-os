import { PrismaPg } from '@prisma/adapter-pg';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../../prisma/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
  .map((o) => o.trim())
  .filter(Boolean) ?? ['http://localhost:3001'];

export const auth = betterAuth({
  basePath: '/api/auth',
  trustedOrigins: allowedOrigins,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'],
        required: true,
        input: false,
      },
      setPasswordToken: {
        type: 'string',
        required: false,
        input: false,
      },
      setPasswordTokenExpires: {
        type: 'date',
        required: false,
        input: false,
      },
      resetPasswordToken: {
        type: 'string',
        required: false,
        input: false,
      },
      resetPasswordTokenExpires: {
        type: 'date',
        required: false,
        input: false,
      },
      createdBy: {
        type: 'string',
        required: false,
        input: false,
      },
      lastLoginAt: {
        type: 'date',
        required: false,
        input: false,
      },
    },
  },
});
