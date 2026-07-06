import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { CreateAcademicYearDto } from './create-academic-year.dto.js';

export class UpdateAcademicYearDto extends PartialType(
  OmitType(CreateAcademicYearDto, ['name'] as const),
) {}
