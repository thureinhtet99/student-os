import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';

@ApiTags('Auth')
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

  // @Get('list-sessions')
  // @ApiOkResponse({
  //   description: 'List of active sessions for the current user',
  //   type: SessionDto,
  //   isArray: true,
  // })
  // async sessions(@Req() req: Request): Promise<SessionDto[]> {
  //   return this.authService.listSessions(req.headers);
  // }

  // @Get('list-accounts')
  // @ApiOperation({ summary: 'List accounts linked to the current user' })
  // @ApiOkResponse({ type: AccountsResponseDto })
  // async accounts(@Req() req: Request): Promise<AccountsResponseDto> {
  //   const accounts = await this.authService.listAccounts(req.headers);
  //   return { accounts };
  // }
}
