import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class StudentSummaryDto {
  @ApiProperty({ example: 'studentid123' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;
}

export class EnrollmentDto {
  @ApiProperty({ example: 'enrollmentid123' })
  id!: string;

  @ApiPropertyOptional({ type: StudentSummaryDto })
  @IsOptional()
  student?: StudentSummaryDto;
}
