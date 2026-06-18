import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsDateString()
  @IsOptional()
  due_date?: string | null;

  @IsString()
  @IsOptional()
  subject_id?: string | null;
}
