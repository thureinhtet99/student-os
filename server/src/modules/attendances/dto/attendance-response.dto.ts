import { ApiProperty } from '@nestjs/swagger';

export class AttendanceResponseDto {
  @ApiProperty({ example: 'ckx123attendanceid' })
  id!: string;

  @ApiProperty({ example: true })
  present!: boolean;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  date!: Date;

  @ApiProperty({ example: 'ckx123enrollmentid' })
  enrollmentId!: string;

  @ApiProperty({ example: 'ckx123academicyearid' })
  academicYearId!: string;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  createdAt!: Date;
}
