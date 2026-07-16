import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../../../../prisma/generated/prisma/client.js';

export class TeacherResponseDto {
  @ApiProperty({ type: String, example: 'teacherid123' })
  id!: string;

  @ApiProperty({ type: String, example: 'user123' })
  userId!: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  name!: string;

  @ApiProperty({ type: String, example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ type: String, example: 'TCH-12345' })
  employeeCode!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'http://example.com/image.png',
    nullable: true,
  })
  image?: string | null;

  @ApiPropertyOptional({ type: String, example: '1234567890', nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '123 Main St, Anytown',
    nullable: true,
  })
  address?: string | null;

  @ApiProperty({ enum: UserGender, example: UserGender.MALE })
  gender!: UserGender;

  @ApiPropertyOptional({
    example: '2005-08-24T00:00:00.000Z',
    type: String,
    nullable: true,
  })
  dateOfBirth?: string | null;

  // @ApiPropertyOptional({ type: [TeachingAllocationDto] })
  // teachingAllocations?: TeachingAllocationDto[];

  @ApiPropertyOptional({
    type: String,
    example: 'academicYearId123',
    nullable: true,
  })
  academicYearId?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'setPasswordToken123',
    nullable: true,
    readOnly: true,
  })
  setPasswordToken?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '2005-08-24T00:00:00.000Z',
    nullable: true,
    readOnly: true,
  })
  setPasswordTokenExpires?: Date | null;

  @ApiPropertyOptional({
    type: String,
    example: 'resetPasswordToken123',
    nullable: true,
    readOnly: true,
  })
  resetPasswordToken?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '2005-08-24T00:00:00.000Z',
    nullable: true,
    readOnly: true,
  })
  resetPasswordTokenExpires?: Date | null;

  @ApiPropertyOptional({
    type: String,
    example: '2005-08-24T00:00:00.000Z',
    nullable: true,
    readOnly: true,
  })
  lastLoginAt?: Date | null;
}
