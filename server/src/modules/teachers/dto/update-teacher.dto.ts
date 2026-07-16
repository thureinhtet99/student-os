import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto.js';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  @ApiPropertyOptional({
    type: String,
    example: 'classId123',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  classId?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'subjectId123',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  subjectId?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'academicYearId',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  academicYearId?: string;
}
