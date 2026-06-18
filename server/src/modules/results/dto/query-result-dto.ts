import { IsOptional, IsString } from 'class-validator';

export class QueryResultDto {
  @IsString()
  @IsOptional()
  student_id?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
