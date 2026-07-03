import { ApiProperty } from '@nestjs/swagger';
import { Exam } from '../../../../prisma/generated/prisma/client';

export class ResultResponseDto {
  @ApiProperty({ example: 'ckx123resultid' })
  id!: string;

  @ApiProperty({ example: 88 })
  score!: number;

  @ApiProperty({ example: 'Solid performance', nullable: true })
  comment!: string | null;

  @ApiProperty({ example: 'ckx123examid', nullable: true })
  examId!: string | null;

  @ApiProperty({ example: 'ckx123academicyearid' })
  academicYearId!: string;

  @ApiProperty({ example: 'ckx123enrollmentid' })
  enrollmentId!: string;

  @ApiProperty({ type: Object, nullable: true })
  exam!: Exam | null;
}
