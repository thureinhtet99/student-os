import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../prisma/generated/prisma/client';

export class UserResponseDto {
  @ApiProperty({ type: String })
  @IsString()
  name!: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  image!: string | null;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role!: string;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  setPasswordToken!: string | null;

  @ApiProperty({ type: Date, nullable: true })
  @IsOptional()
  setPasswordTokenExpires!: Date | null;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  resetPasswordToken!: string | null;

  @ApiProperty({ type: Date, nullable: true })
  @IsOptional()
  resetPasswordTokenExpires!: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  lastLoginAt!: Date | null;

  @ApiProperty({ type: String })
  @IsString()
  id!: string;
}
