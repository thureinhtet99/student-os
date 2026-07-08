import { ApiProperty } from '@nestjs/swagger';

class TeachingAssignmentDto {
  @ApiProperty({ example: 'ckx123teachingassignmentid' })
  id!: string;
}

export class SubjectResponseDto {
  @ApiProperty({ example: 'ckx123subjectid' })
  id!: string;

  @ApiProperty({ example: 'Mathematics' })
  name!: string;

  @ApiProperty({ example: 'Advanced algebra and calculus', nullable: true })
  description!: string | null;

  @ApiProperty({ type: [TeachingAssignmentDto] })
  teachingAssignments!: TeachingAssignmentDto[];

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
