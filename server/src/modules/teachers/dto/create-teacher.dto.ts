import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class CreateTeacherDto extends CreateUserDto {
  @ApiPropertyOptional({
    type: String,
    example: { name: 'Grade-10' },
    nullable: true,
  })
  @IsString()
  @IsOptional()
  class?: {
    name: string;
  } | null;

  @ApiPropertyOptional({
    type: String,
    example: 'English',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  subject?: {
    name: string;
  } | null;

  @ApiPropertyOptional({ type: String, example: 'academicYearId' })
  @IsString()
  @IsOptional()
  academicYearId?: string;
}
