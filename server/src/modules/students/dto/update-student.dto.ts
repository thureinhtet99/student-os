import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class UpdateStudentDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    type: String,
    example: 'John Doe Sr.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  parentName?: string | null;

  @ApiPropertyOptional({ type: String, example: '1234567890', nullable: true })
  @IsString()
  @IsOptional()
  parentPhone?: string | null;

  @ApiPropertyOptional({ type: String, example: '123 Main St', nullable: true })
  @IsString()
  @IsOptional()
  parentAddress?: string | null;

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
