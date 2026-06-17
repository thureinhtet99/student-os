import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsBoolean()
  @IsNotEmpty()
  present!: boolean;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  student_id!: string;
}
