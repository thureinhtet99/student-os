import { ApiProperty } from '@nestjs/swagger';

export class ClassResponseDto {
  @ApiProperty({ example: 'ckx123classid' })
  id!: string;

  @ApiProperty({ example: 'Grade 10 A' })
  name!: string;

  @ApiProperty({ example: 'ckx123academicyearid' })
  academicYearId!: string;

  @ApiProperty({ example: '2025-2026', nullable: true })
  academicYearName!: string | null;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
