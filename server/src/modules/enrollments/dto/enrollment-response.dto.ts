import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty({ example: 'enrollmentid123' })
  id!: string;

  @ApiProperty({ example: 'ckx123studentid' })
  studentId!: string;

  @ApiProperty({ example: 'ckx123classid' })
  classId!: string;

  @ApiProperty({ example: 'academicyearid123' })
  academicYearId!: string;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
