import { IsOptional, IsString } from 'class-validator';

export class QueryLessonDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
