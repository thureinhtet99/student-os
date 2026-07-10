import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateAcademicYearDto } from './create-academic-year.dto.js';

export class UpdateAcademicYearDto extends PartialType(
  OmitType(CreateAcademicYearDto, ['isCurrent'] as const),
) {
  @ApiProperty({ type: String, example: '2025-2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ type: String, example: '2025-06-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ type: String, example: '2026-05-31T23:59:59.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;
}
