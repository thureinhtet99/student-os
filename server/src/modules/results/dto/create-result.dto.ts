import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateResultDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  score!: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment?: string | null;

  @IsString()
  @IsOptional()
  exam_id?: string | null;

  @IsString()
  @IsOptional()
  assignment_id?: string | null;

  @IsString()
  @IsNotEmpty()
  student_id!: string;
}
