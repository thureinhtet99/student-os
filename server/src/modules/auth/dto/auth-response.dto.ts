import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { UserRole } from '../../../../prisma/generated/prisma/client.js';
import { UserResponseDto } from '../../../common/dto/user-response.dto.js';

class SessionUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ required: false, nullable: true })
  image?: string | null;
}

class SessionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  token!: string;

  @ApiProperty()
  expiresAt!: Date;

  @ApiProperty({ required: false, nullable: true })
  ipAddress?: string | null;

  @ApiProperty({ required: false, nullable: true })
  userAgent?: string | null;
}

export class SessionResponseDto {
  @ApiProperty({ type: SessionUserDto })
  user!: SessionUserDto;

  @ApiProperty({ type: SessionDto })
  session!: SessionDto;
}

class AccountDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty()
  accountId!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class AccountsResponseDto {
  @ApiProperty({ type: [AccountDto] })
  accounts!: AccountDto[];
}

export class SignOutResponseDto {
  @ApiProperty({ example: 'Signed out successfully' })
  message!: string;
}

export class SignInResponseDto {
  @ApiProperty()
  @IsBoolean()
  redirect!: boolean;

  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty()
  user!: UserResponseDto;
}
