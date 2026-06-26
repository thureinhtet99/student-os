import type { UserSession } from '@thallesp/nestjs-better-auth';
import type { auth } from '../utils/auth.js';

export type SessionUser = UserSession<typeof auth>;
