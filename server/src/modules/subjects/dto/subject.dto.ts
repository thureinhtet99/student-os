import { ApiProperty } from '@nestjs/swagger';

export class SubjectDto {
  @ApiProperty({ example: 'ckx123subjectid' })
  id!: string;

  @ApiProperty({ example: 'Mathematics' })
  name!: string;
}
