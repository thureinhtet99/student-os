import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../prisma/generated/prisma/client';

export class UserResponseDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsOptional()
  image!: string | null;

  @ApiProperty()
  @IsEnum(UserRole)
  role!: string;

  @ApiProperty()
  @IsOptional()
  setPasswordToken!: string;

  @ApiProperty()
  @IsOptional()
  setPasswordTokenExpires!: Date;

  @ApiProperty()
  @IsOptional()
  resetPasswordToken!: string;

  @ApiProperty()
  @IsOptional()
  resetPasswordTokenExpires!: Date;

  @ApiProperty()
  @IsOptional()
  lastLoginAt!: Date;

  @ApiProperty()
  @IsString()
  id!: string;
}
