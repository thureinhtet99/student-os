import { ApiProperty } from '@nestjs/swagger';

export class ClassDto {
  @ApiProperty({ example: 'classid123' })
  id!: string;

  @ApiProperty({ example: 'Grade 10' })
  name!: string;
}
