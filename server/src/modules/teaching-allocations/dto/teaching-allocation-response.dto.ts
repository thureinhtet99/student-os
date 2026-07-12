import { ApiProperty } from '@nestjs/swagger';

export class TeachingAllocationResponseDto {
  @ApiProperty({ example: 'ckx123teachingassignmentid' })
  id!: string;

  @ApiProperty({ example: 'ckx123teacherid' })
  teacherId!: string;

  @ApiProperty({ example: 'ckx123subjectid' })
  subjectId!: string;

  @ApiProperty({ example: 'ckx123classid' })
  classId!: string;

  @ApiProperty({ example: 'academicyearid123' })
  academicYearId!: string;
}
