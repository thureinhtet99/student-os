import { Controller, Get, Post, Req } from '@nestjs/common';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import {
  AccountsResponseDto,
  SessionResponseDto,
} from './dto/auth-response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me(@Session() session: UserSession): SessionResponseDto {
    return session as SessionResponseDto;
  }

  @AllowAnonymous()
  @Get('session')
  async session(@Req() req: Request) {
    return this.authService.getSession(req.headers);
  }

  @AllowAnonymous()
  @Post('sign-out')
  async signOut(@Req() req: Request) {
    await this.authService.signOut(req.headers);
    return { message: 'Signed out successfully' };
  }

  @Get('accounts')
  async accounts(@Req() req: Request): Promise<AccountsResponseDto> {
    const accounts = await this.authService.listAccounts(req.headers);
    return { accounts: accounts };
  }
}
