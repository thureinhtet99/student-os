import { IsOptional, IsString } from 'class-validator';

export class QuerySubjectDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
