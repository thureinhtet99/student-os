import { ApiProperty } from '@nestjs/swagger';

export class ClassDto {
  @ApiProperty({ example: 'ckx123classid' })
  id!: string;
  @ApiProperty({ example: 'Grade 10' })
  name!: string;
}
