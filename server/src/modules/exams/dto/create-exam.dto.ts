import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ example: 'Mid Term Examination' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'Covers chapters 1-6', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description!: string | null;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  totalMarks!: number;

  @ApiProperty({ example: 40 })
  @IsNumber()
  @IsNotEmpty()
  passMarks!: number;

  @ApiProperty({ example: '2026-07-10T09:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @ApiProperty({ example: '2026-07-10T11:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @ApiProperty({ example: 'ckx123teachingassignmentid' })
  @IsString()
  @IsNotEmpty()
  teachingAssignmentId!: string;

  @ApiProperty({ example: 'ckx123academicyearid' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;
}
