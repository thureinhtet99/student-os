import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class QueryAttendanceDto {
  @ApiPropertyOptional({ example: 'ckx123enrollmentid' })
  @IsString()
  @IsOptional()
  enrollmentId?: string;

  @ApiPropertyOptional({ example: 'ckx123academicyearid' })
  @IsString()
  @IsOptional()
  academicYearId?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  present?: boolean;

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
