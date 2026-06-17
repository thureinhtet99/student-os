import { IsOptional, IsString } from 'class-validator';

export class QueryAdminDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
