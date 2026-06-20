import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  UserGender,
  UserRole,
} from '../../../../prisma/generated/prisma/client.js';

export class SignUpDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase, one lowercase, one number and one special character',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(200)
  name!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;
}