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
import { TeachingAllocationDto } from '../../teaching-allocations/dto/teaching-allocation.dto';

export class CreateClassDto {
  @ApiProperty({ example: 'Grade 10' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({
    example: 'clx123academicyearid',
  })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['clx123studentid'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  studentIds?: string[];

  @ApiPropertyOptional({
    type: [TeachingAllocationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeachingAllocationDto)
  @IsOptional()
  teachingAllocations?: TeachingAllocationDto[];
}
