import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AcademicYearDto } from '../../academic-years/dto/academic-year.dto';
import { EnrollmentDto } from '../../enrollments/dto/enrollment.dto';
import { TeachingAllocationDto } from '../../teaching-allocations/dto/teaching-allocation.dto';

class ClassTeachingAllocationDto extends OmitType(TeachingAllocationDto, [
  'class',
] as const) {}

export class ClassResponseDto {
  @ApiProperty({ example: 'classid123' })
  id!: string;

  @ApiProperty({ example: 'Grade 1A' })
  name!: string;

  @ApiPropertyOptional({ type: AcademicYearDto })
  @IsOptional()
  academicYear?: AcademicYearDto;

  @ApiPropertyOptional({ type: [EnrollmentDto] })
  @IsOptional()
  enrollments?: EnrollmentDto[];

  @ApiPropertyOptional({ type: [ClassTeachingAllocationDto] })
  @IsOptional()
  teachingAllocations?: ClassTeachingAllocationDto[];
}
