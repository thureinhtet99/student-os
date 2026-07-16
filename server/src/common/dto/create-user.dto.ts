import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { UserGender } from '../../../prisma/generated/prisma/client';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'john doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  name!: string;

  @ApiProperty({
    type: String,
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: String,
    example: 'password123',
  })
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({
    type: String,
    example: '123456789',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(15)
  phone?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '123 Main St, Anytown',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  address?: string | null;

  @ApiProperty({
    type: String,
    example: 'MALE',
  })
  @IsNotEmpty()
  @IsEnum(UserGender)
  gender!: UserGender;

  @ApiPropertyOptional({
    type: String,
    example: '2005-08-24T00:00:00.000Z',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'http://example.com/image.png',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  image?: string | null;

  // @ApiProperty({
  //   type: String,
  //   example: 'STUDENT',
  // })
  // @IsNotEmpty()
  // @IsEnum(UserRole)
  // role!: UserRole;
}
