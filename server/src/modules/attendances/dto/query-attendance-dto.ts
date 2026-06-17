import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class QueryAttendanceDto {
  @IsString()
  @IsOptional()
  student_id?: string;

  @IsBoolean()
  @IsOptional()
  present?: boolean;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
