import { ApiProperty } from '@nestjs/swagger';

export class TeachingAssignmentResponseDto {
  @ApiProperty({ example: 'ckx123teachingassignmentid' })
  id!: string;

  @ApiProperty({ example: 'ckx123teacherid' })
  teacherId!: string;

  @ApiProperty({ example: 'ckx123subjectid' })
  subjectId!: string;

  @ApiProperty({ example: 'ckx123classid' })
  classId!: string;

  @ApiProperty({ example: 'ckx123academicyearid' })
  academicYearId!: string;
}
