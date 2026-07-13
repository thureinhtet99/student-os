import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserGender } from '../../../../prisma/generated/prisma/client';
import { QueryDto } from '../../../common/dto/query.dto';

export class QueryStudentDto extends QueryDto {
  @ApiPropertyOptional({ description: 'Filter by class ID.' })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiPropertyOptional({
    description: 'Filter by gender.',
    enum: UserGender,
  })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;
}
