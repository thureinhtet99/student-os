import { ApiProperty } from '@nestjs/swagger';

export class AcademicYearDto {
  @ApiProperty({ example: 'academicyearid' })
  id!: string;

  @ApiProperty({ type: String, example: '2024-2025' })
  name!: string;
}
