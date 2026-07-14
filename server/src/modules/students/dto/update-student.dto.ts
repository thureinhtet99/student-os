import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class UpdateStudentDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ type: String, example: 'parentId123', nullable: true })
  @IsString()
  @IsOptional()
  parentId?: string | null;

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
    example: 'academicYearId',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  academicYearId?: string;
}
