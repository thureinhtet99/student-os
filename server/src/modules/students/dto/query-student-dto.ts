import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserGender } from '../../../../prisma/generated/prisma/client';
import { QueryDto } from '../../../common/dto/query.dto';

export class QueryStudentDto extends QueryDto {
  @IsOptional()
  @IsString()
  class?: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;
}
