import { IsOptional, IsString } from 'class-validator';

export class QueryExamDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
