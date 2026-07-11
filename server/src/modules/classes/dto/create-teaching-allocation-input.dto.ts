import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeachingAllocationInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subjectId!: string;
}
