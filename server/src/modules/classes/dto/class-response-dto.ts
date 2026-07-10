import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AcademicYearResponseDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
}

class EnrolledStudentDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
}

class EnrollmentResponseDto {
  @ApiProperty()
  enrollmentId!: string;
  @ApiProperty()
  student!: EnrolledStudentDto;
}

class AllocatedTeacherDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
}
class AllocatedSubjectDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
}
class TeachingAllocationResponseDto {
  @ApiProperty()
  allocationId!: string;
  @ApiProperty()
  teacher!: AllocatedTeacherDto;
  @ApiProperty()
  subject!: AllocatedSubjectDto;
}

export class ClassResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ type: AcademicYearResponseDto })
  academicYear?: AcademicYearResponseDto;

  @ApiPropertyOptional({ type: [EnrollmentResponseDto] })
  enrollments?: EnrollmentResponseDto[];

  @ApiPropertyOptional({ type: [TeachingAllocationResponseDto] })
  teachingAllocations?: TeachingAllocationResponseDto[];
}
