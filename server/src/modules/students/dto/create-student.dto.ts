import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ParentRelationship } from '../../../../prisma/generated/prisma/client.js';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class CreateStudentDto extends CreateUserDto {
  @ApiPropertyOptional({
    enum: ParentRelationship,
    example: 'GUARDIAN',
    nullable: true,
  })
  parent_student_relationship?: ParentRelationship | null;

  @ApiPropertyOptional({
    type: Object,
    example: {
      name: 'John Doe Sr.',
      phone: '1234567890',
      address: '123 Main St',
    },
    nullable: true,
  })
  parent?: {
    name: string;
    phone?: string | null;
    address?: string | null;
  } | null;

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

  @ApiPropertyOptional({ type: String, example: 'academicYearId' })
  @IsString()
  @IsOptional()
  academicYearId?: string;
}
