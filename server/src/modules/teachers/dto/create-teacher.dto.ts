import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class CreateTeacherDto extends CreateUserDto {
  @ApiPropertyOptional({
    type: String,
    example: 'classId123',
  })
  @IsString()
  @IsOptional()
  classId?: string | null;

  @ApiPropertyOptional({ type: String, example: 'academicYearId' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;
}
