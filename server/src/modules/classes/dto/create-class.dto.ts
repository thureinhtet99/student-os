import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ example: 'Grade 10' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({
    example: 'ckx123academicyearid',
    description:
      'Defaults to the active academic year (from x-academic-year-id header or isCurrent = true) when omitted.',
  })
  @IsString()
  @IsOptional()
  academicYearId?: string;
}
