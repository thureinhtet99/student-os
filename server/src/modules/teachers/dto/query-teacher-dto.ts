import { IsEnum, IsOptional } from 'class-validator';
import { UserGender } from '../../../../prisma/generated/prisma/client.js';
import { QueryDto } from '../../../common/dto/query.dto.js';

export class QueryTeacherDto extends QueryDto {
  @IsEnum(UserGender)
  @IsOptional()
  filter?: UserGender;
}
