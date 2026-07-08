import { ApiProperty } from '@nestjs/swagger';

export class ResultResponseDto {
  @ApiProperty({ example: 'ckx123resultid' })
  id!: string;

  @ApiProperty({ example: 88 })
  score!: number | null;

  @ApiProperty({ example: 'Solid performance', nullable: true })
  comment!: string | null;

  @ApiProperty({ example: 'ckx123examid', nullable: true })
  examId!: string | null;

  @ApiProperty({ example: 'ckx123academicyearid' })
  academicYearId!: string;

  @ApiProperty({ example: 'ckx123enrollmentid' })
  enrollmentId!: string;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
