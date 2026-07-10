import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TeachingAllocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subjectId!: string;
}

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'Grade 10' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiProperty({
    description:
      'The academic year in which to update the class associations (enrollments, allocations)',
    example: 'ckx123academicyearid',
  })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;

  @ApiPropertyOptional({
    description:
      'Provide a full list of student IDs to be in this class for the given academic year. This will replace existing enrollments.',
    type: [String],
    example: ['clx...studentid...'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  studentIds?: string[];

  @ApiPropertyOptional({
    description:
      'Provide a full list of teaching allocations for this class for the given academic year. This will replace existing allocations.',
    type: [TeachingAllocationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeachingAllocationDto)
  @IsOptional()
  teachingAllocations?: TeachingAllocationDto[];
}
