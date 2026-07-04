import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { AccountsResponseDto } from './dto/auth-response.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signin')
  // @ApiOperation({
  //   summary:
  //     'Sign in with email and password. This will invalidate all other active sessions for the user.',
  // })
  // @ApiBody({ type: SignInDto })
  // @ApiResponse({ status: 200, type: SessionResponseDto })
  // async signIn(@Body() signInDto: SignInDto) {
  //   return this.authService.signIn(signInDto);
  // }

  @Get('accounts')
  @ApiOperation({ summary: 'List accounts linked to the current user' })
  @ApiResponse({ status: 200, type: AccountsResponseDto })
  async accounts(@Req() req: Request): Promise<AccountsResponseDto> {
    const accounts = await this.authService.listAccounts(req.headers);
    return { accounts: accounts };
  }
}
