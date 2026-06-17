import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsOptional()
  subject_id?: string | null;
}
