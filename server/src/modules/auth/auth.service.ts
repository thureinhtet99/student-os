import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { checkDuplicate } from '../../common/utils/db.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    try {
      const { email, password, role } = signUpDto;

      await checkDuplicate(
        this.prisma.user,
        'email',
        email,
        null,
        'User with this email already exists',
      );

      const hashedPwd = await bcrypt.hash(password, this.SALT_ROUNDS);
      const user = await this.prisma.user.create({
        data: { email, password: hashedPwd, role },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      const { access_token, refresh_token } = await this.generateToken(
        user.id,
        user.email,
      );
      return { access_token, refresh_token, user };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error during account register:', message);
      throw new InternalServerErrorException(
        'An error occurred during account register',
      );
    }
  }

  // Generate token
  private async generateToken(
    id: string,
    email: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload = { id, email };
    const refreshId = randomBytes(16).toString('hex');

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!jwtSecret || !jwtRefreshSecret)
      throw new InternalServerErrorException('JWT secrets are not configured');

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '300s',
        secret: jwtSecret,
      }),
      this.jwtService.signAsync(
        { ...payload, refreshId },
        {
          expiresIn: '7d',
          secret: jwtRefreshSecret,
        },
      ),
    ]);

    return { access_token, refresh_token };
  }
}
