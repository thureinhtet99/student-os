import { ApiProperty } from '@nestjs/swagger';
import { AcademicYear } from '../../../../prisma/generated/prisma/client';

export class ClassResponseDto {
  @ApiProperty({ example: 'ckx123classid' })
  id!: string;

  @ApiProperty({ example: 'Grade 10 A' })
  name!: string;

  @ApiProperty({
    type: Object,
    nullable: true,
    description: 'Academic year record for this class',
  })
  academicYear!: AcademicYear | null;

  @ApiProperty({ example: 'ckx123academicyearid' })
  academicYearId!: string;

  @ApiProperty({ example: '2025-2026' })
  academicYearName!: string | null;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z', nullable: true })
  createdAt!: Date | null;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z', nullable: true })
  updatedAt!: Date | null;
}
