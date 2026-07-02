import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { AccountsResponseDto } from './dto/auth-response.dto.js';

// Note: sign-in, sign-up, sign-out, and get-session are handled directly by
// better-auth's HTTP handler mounted at /api/v1/auth (see common/utils/auth.ts
// and the AuthModule.forRoot registration in app.module.ts). This controller
// only exposes app-specific session helpers that don't have a better-auth
// equivalent.

@Controller('session')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get('me')
  // me(@Session() session: SessionUser) {
  //   return session;
  // }

  @Get('accounts')
  async accounts(@Req() req: Request): Promise<AccountsResponseDto> {
    const accounts = await this.authService.listAccounts(req.headers);
    return { accounts: accounts };
  }
}
