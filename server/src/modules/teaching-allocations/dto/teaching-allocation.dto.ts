import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class SubjectSummaryDto {
  @ApiProperty({ type: String, example: 'subjectid123' })
  id!: string;

  @ApiProperty({ type: String, example: 'English' })
  name!: string;
}
class ClassSummaryDto {
  @ApiProperty({ type: String, example: 'classid123' })
  id!: string;

  @ApiProperty({ type: String, example: 'Grade 10' })
  name!: string;
}
class TeacherSummaryDto {
  @ApiProperty({ type: String, example: 'teacherid123' })
  id!: string;

  @ApiProperty({ type: String, example: 'Mrs Alice' })
  name!: string;
}

export class TeachingAllocationDto {
  @ApiProperty({ type: String, example: 'teachingallocationid123' })
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
