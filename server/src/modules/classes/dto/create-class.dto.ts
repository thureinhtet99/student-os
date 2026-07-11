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
import { CreateTeachingAllocationInputDto } from './create-teaching-allocation-input.dto';

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
    type: [CreateTeachingAllocationInputDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeachingAllocationInputDto)
  @IsOptional()
  teachingAllocations?: CreateTeachingAllocationInputDto[];
}
