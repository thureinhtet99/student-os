import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  present!: boolean;

  @ApiProperty({ example: '2026-07-03' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: 'enrollmentid123' })
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string;

  @ApiProperty({ example: 'academicyearid123' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;
}
