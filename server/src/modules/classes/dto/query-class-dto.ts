import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto.js';

export class QueryClassDto extends QueryDto {
  @ApiPropertyOptional({ example: 'ckx123academicyearid' })
  @IsString()
  @IsOptional()
  academicYearId?: string;
}
