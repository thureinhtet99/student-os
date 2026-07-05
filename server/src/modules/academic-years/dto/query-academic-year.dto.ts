import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';

export class QueryAcademicYearDto extends OmitType(QueryDto, [
  'search',
] as const) {
  @ApiPropertyOptional({ example: '2025-2026' })
  @IsString()
  @IsOptional()
  year?: string;
}
