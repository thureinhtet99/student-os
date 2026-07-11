import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class SubjectSummaryDto {
  @ApiProperty({ example: 'subjectid123' })
  id!: string;

  @ApiProperty({ example: 'English' })
  name!: string;
}
class ClassSummaryDto {
  @ApiProperty({ example: 'classid123' })
  id!: string;

  @ApiProperty({ example: 'Grade 10' })
  name!: string;
}
class TeacherSummaryDto {
  @ApiProperty({ example: 'teacherid123' })
  id!: string;

  @ApiProperty({ example: 'Mrs Alice' })
  name!: string;
}

export class TeachingAllocationDto {
  @ApiProperty({ example: 'teachingallocationid123' })
  id!: string;

  @ApiPropertyOptional({ type: SubjectSummaryDto })
  @IsOptional()
  subject?: SubjectSummaryDto;

  @ApiPropertyOptional({ type: ClassSummaryDto })
  @IsOptional()
  class?: ClassSummaryDto;

  @ApiPropertyOptional({ type: TeacherSummaryDto })
  @IsOptional()
  teacher?: TeacherSummaryDto;
}
