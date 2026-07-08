import { ApiProperty } from '@nestjs/swagger';

class ParentDto {
  @ApiProperty({ example: 'ckx123parentid' })
  id!: string;
  @ApiProperty({ example: 'Jane Doe' })
  name!: string;
}

class EnrollmentDto {
  @ApiProperty({ example: 'ckx123enrollmentid' })
  id!: string;
}

export class StudentResponseDto {
  @ApiProperty({ example: 'ckx123userid' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: 'STU-12345' })
  studentId!: string;

  @ApiProperty({ example: 'http://example.com/image.png', nullable: true })
  image!: string | null;

  @ApiProperty({ type: ParentDto, nullable: true })
  parent!: ParentDto | null;

  @ApiProperty({ type: EnrollmentDto, nullable: true })
  enrollment!: EnrollmentDto | null;

  @ApiProperty({ nullable: true })
  setPasswordToken!: string | null;

  @ApiProperty({ nullable: true })
  setPasswordTokenExpires!: Date | null;

  @ApiProperty({ nullable: true })
  resetPasswordToken!: string | null;

  @ApiProperty({ nullable: true })
  resetPasswordTokenExpires!: Date | null;

  @ApiProperty({ nullable: true })
  lastLoginAt!: Date | null;
}
