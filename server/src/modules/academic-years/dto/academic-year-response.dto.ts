import { ApiProperty } from '@nestjs/swagger';

export class AcademicYearResponseDto {
  @ApiProperty({ example: 'ckx123academicyearid' })
  id!: string;

  @ApiProperty({ example: '2025-2026' })
  name!: string;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z' })
  startDate!: Date;

  @ApiProperty({ example: '2026-05-31T23:59:59.000Z' })
  endDate!: Date;

  @ApiProperty({ example: true })
  isCurrent!: boolean;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
