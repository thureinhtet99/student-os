import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  limit?: number;
}
