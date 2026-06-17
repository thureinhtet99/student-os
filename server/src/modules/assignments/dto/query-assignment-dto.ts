import { IsOptional, IsString } from 'class-validator';

export class QueryAssignmentDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
