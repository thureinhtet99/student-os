import { IsOptional, IsString } from 'class-validator';

export class QueryEventDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  classId?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
