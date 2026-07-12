import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 'ckx123studentid' })
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({ example: 'ckx123classid' })
  @IsString()
  @IsNotEmpty()
  classId!: string;

  @ApiProperty({ example: 'academicyearid123' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;
}
