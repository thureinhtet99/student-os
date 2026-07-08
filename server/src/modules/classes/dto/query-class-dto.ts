import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto.js';

export class QueryClassDto extends QueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  academicYearId?: string;
}
