import { IsOptional, IsString } from 'class-validator';

export class QueryAnnouncementDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  class_id?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
