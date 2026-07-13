import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryAnnouncementDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ type: String, example: 'classid123' })
  @IsString()
  @IsOptional()
  classId?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}
