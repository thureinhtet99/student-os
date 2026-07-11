import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EnrollmentDto } from '../../enrollments/dto/enrollment.dto';
import { TeachingAllocationDto } from '../../teaching-allocations/dto/teaching-allocation.dto';

export class ClassResponseDto {
  @ApiProperty({ example: 'classid123' })
  id!: string;

  @ApiProperty({ example: 'Grade 1A' })
  name!: string;

  @ApiPropertyOptional({ type: [EnrollmentDto] })
  @IsOptional()
  enrollments?: EnrollmentDto[];

  @ApiPropertyOptional({ type: [TeachingAllocationDto] })
  @IsOptional()
  teachingAllocations?: TeachingAllocationDto[];
}
