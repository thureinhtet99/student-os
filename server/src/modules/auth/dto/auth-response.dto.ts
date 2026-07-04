import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserResponseDto } from '../../../common/dto/user-response.dto.js';

class SessionDto {
  @ApiProperty({ type: Date })
  expiresAt!: Date;

  @ApiProperty({ type: String })
  token!: string;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  ipAddress!: string;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  userAgent!: string;

  @ApiProperty({ type: String })
  userId!: string;

  @ApiProperty({ type: String })
  @IsString()
  id!: string;
}

export class SessionResponseDto {
  @ApiProperty({ type: SessionDto })
  session!: SessionDto;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ type: Boolean })
  needsRefresh!: boolean;
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
  @ApiProperty()
  @IsBoolean()
  success!: boolean;
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
