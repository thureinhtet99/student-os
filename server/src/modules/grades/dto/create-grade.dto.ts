import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateGradeDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  level!: number;
}
