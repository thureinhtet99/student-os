import { IsOptional } from 'class-validator';

export class QueryGradeDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
