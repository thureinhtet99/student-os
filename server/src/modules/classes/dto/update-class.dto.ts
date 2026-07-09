import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateClassDto } from './create-class.dto.js';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @ApiProperty({ example: 'Grade 10' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ example: 'ckx123academicyearid' })
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;
}
