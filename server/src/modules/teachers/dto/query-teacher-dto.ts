import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserGender } from '../../../../prisma/generated/prisma/client.js';

export class QueryTeacherDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(UserGender)
  @IsOptional()
  filter?: UserGender;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
