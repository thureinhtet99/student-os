import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateResultDto {
  @ApiProperty({ example: 88 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  score!: number;

  @ApiProperty({ example: 'Solid performance', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment!: string | null;

  @ApiProperty({ example: 'ckx123examid', required: false })
  @IsString()
  @IsOptional()
  examId!: string | null;

  @ApiProperty({ example: 'academicyearid123' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;

  @ApiProperty({ example: 'enrollmentid123' })
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string;
}
