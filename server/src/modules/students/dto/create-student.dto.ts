import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ParentRelationship } from '../../../../prisma/generated/prisma/client.js';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

class CreateStudentParentDto {
  @ApiPropertyOptional({ type: String, example: 'John Doe Sr.' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ type: String, example: '1234567890', nullable: true })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional({ type: String, example: '123 Main St', nullable: true })
  @IsOptional()
  @IsString()
  address?: string | null;
}

export class CreateStudentDto extends CreateUserDto {
  @ApiPropertyOptional({
    enum: ParentRelationship,
    example: 'GUARDIAN',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(ParentRelationship)
  parent_student_relationship?: ParentRelationship | null;

  @ApiPropertyOptional({
    type: CreateStudentParentDto,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStudentParentDto)
  parent?: CreateStudentParentDto | null;

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
  academicYearId?: string | null;
}
