import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { StudentDto } from '../../students/dto/student.dto';
import { SubjectDto } from '../../subjects/dto/subject.dto';
import { TeacherDto } from '../../teachers/dto/teacher.dto';

class StudentSummaryDto extends PickType(StudentDto, ['id'] as const) {}

class TeacherSummaryDto extends PickType(TeacherDto, ['id'] as const) {}

class SubjectSummaryDto extends PickType(SubjectDto, ['id'] as const) {}

class TeachingAllocationRefDto {
  @ApiProperty({ type: TeacherSummaryDto })
  teacher!: TeacherSummaryDto;

  @ApiProperty({ type: SubjectSummaryDto })
  subject!: SubjectSummaryDto;
}

export class CreateClassResponse {
  @ApiProperty({ example: 'Grade 10' })
  name!: string;

  @ApiProperty({ example: 'academicyearid123' })
  academicYearId!: string;

  @ApiPropertyOptional({ type: [StudentSummaryDto] })
  @IsArray()
  @IsOptional()
  students?: StudentSummaryDto[];

  @ApiPropertyOptional({ type: [TeachingAllocationRefDto] })
  @IsArray()
  @IsOptional()
  teachingAllocations?: TeachingAllocationRefDto[];
}
