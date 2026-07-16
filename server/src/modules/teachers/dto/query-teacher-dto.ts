import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserGender } from '../../../../prisma/generated/prisma/client.js';
import { QueryDto } from '../../../common/dto/query.dto.js';

export class QueryTeacherDto extends QueryDto {
  @ApiPropertyOptional({ description: 'Filter by class ID.' })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiPropertyOptional({
    description: 'Filter by gender.',
    enum: UserGender,
  })
  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;
}
