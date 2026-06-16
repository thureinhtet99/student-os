import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  UserGender,
  UserRole,
} from '../../../../prisma/generated/prisma/client.js';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phone!: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address!: string | null;

  @IsEnum(UserGender)
  gender!: UserGender;

  @IsDateString()
  @IsOptional()
  birthday!: string | null;

  @IsString()
  @IsOptional()
  image!: string | null;

  @IsEnum(UserRole)
  @IsOptional()
  role!: UserRole;

  @IsString()
  @IsOptional()
  parent_id!: string | null;

  @IsString()
  @IsOptional()
  class_id!: string | null;

  @IsString()
  @IsOptional()
  grade_id!: string | null;
}
