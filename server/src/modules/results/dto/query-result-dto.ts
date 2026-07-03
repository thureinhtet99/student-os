import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryResultDto {
  @ApiPropertyOptional({ example: 'ckx123enrollmentid' })
  @IsString()
  @IsOptional()
  enrollmentId?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  limit?: number;
}
