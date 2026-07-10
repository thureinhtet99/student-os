import { ApiProperty } from '@nestjs/swagger';

export class TeachingAllocationDto {
  @ApiProperty({ example: 'ckx123teachingallocationid' })
  id!: string;

  @ApiProperty({ example: 'ckx123subjectid' })
  subjectId!: string;

  @ApiProperty({ example: 'ckx123classid' })
  classId!: string;

  @ApiProperty({ example: 'ckx123teacherid' })
  teacherId!: string;
}
