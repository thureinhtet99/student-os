import { Injectable } from '@nestjs/common';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { IncomingHttpHeaders } from 'node:http';
import { auth } from '../../common/utils/auth.js';

@Injectable()
export class AuthService {
  constructor(private readonly betterAuth: BetterAuthService<typeof auth>) {}

  async getSession(headers: IncomingHttpHeaders) {
    return this.betterAuth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
  }

  // Lists of others accounts linked to the current user
  async listAccounts(headers: IncomingHttpHeaders) {
    return this.betterAuth.api.listUserAccounts({
      headers: fromNodeHeaders(headers),
    });
  }

  // Sign out and clears the session cookie.
  async signOut(headers: IncomingHttpHeaders) {
    return this.betterAuth.api.signOut({
      headers: fromNodeHeaders(headers),
    });
  }
}
