import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { UserGender } from '../../../../prisma/generated/prisma/client';

export class QueryStudentDto {
  @IsOptional()
  @IsNumber()
  class?: string;

  @IsOptional()
  @IsNumber()
  grade?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserGender)
  filter?: UserGender;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
