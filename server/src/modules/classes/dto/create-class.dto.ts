import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class CreateTeachingAllocationSummaryDto {
  @ApiProperty({ type: String, example: 'teacherid123' })
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({ type: String, example: 'subjectid123' })
  @IsString()
  @IsNotEmpty()
  subjectId!: string;
}

export class CreateClassDto {
  @ApiProperty({ example: 'Grade 10' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ example: 'academicyearid123' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['studentid123'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  studentIds?: string[];

  @ApiPropertyOptional({
    type: [CreateTeachingAllocationSummaryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeachingAllocationSummaryDto)
  @IsOptional()
  teachingAllocations?: CreateTeachingAllocationSummaryDto[];
}
