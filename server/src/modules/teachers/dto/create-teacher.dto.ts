import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class CreateTeacherDto extends CreateUserDto {
  @ApiPropertyOptional({
    type: String,
    example: 'classId123',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  classId?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'subjectId',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  subjectId?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'academicYearId',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  academicYearId?: string | null;
}
