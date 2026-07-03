import { ApiProperty } from '@nestjs/swagger';

export class ExamResponseDto {
  @ApiProperty({ example: 'ckx123examid' })
  id!: string;

  @ApiProperty({ example: 'Mid Term Examination' })
  title!: string;

  @ApiProperty({ example: 'Covers chapters 1-6', nullable: true })
  description!: string | null;

  @ApiProperty({ example: 100 })
  totalMarks!: number;

  @ApiProperty({ example: 40 })
  passMarks!: number;

  @ApiProperty({ example: '2026-07-10T09:00:00.000Z' })
  startTime!: Date;

  @ApiProperty({ example: '2026-07-10T11:00:00.000Z' })
  endTime!: Date;

  @ApiProperty({ example: 'ckx123teachingassignmentid' })
  teachingAssignmentId!: string;
}
