import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeachingAllocationDto {
  @ApiProperty({ example: 'ckx123teacherid' })
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({ example: 'ckx123subjectid' })
  @IsString()
  @IsNotEmpty()
  subjectId!: string;

  @ApiProperty({ example: 'ckx123classid' })
  @IsString()
  @IsNotEmpty()
  classId!: string;

  @ApiProperty({ example: 'academicyearid123' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;
}
