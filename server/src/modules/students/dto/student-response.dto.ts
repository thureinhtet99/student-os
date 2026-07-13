import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../../../../prisma/generated/prisma/client';

export class StudentResponseDto {
  @ApiProperty({ type: String, example: 'studentid123' })
  id!: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  name!: string;

  @ApiProperty({ type: String, example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ type: String, example: 'STU-studentos123' })
  studentNumber!: string;

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
    // format: 'date-time',
    nullable: true,
  })
  dateOfBirth?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'parentId123',
    nullable: true,
  })
  parentId?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'classId123',
    nullable: true,
  })
  classId?: string | null;

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
