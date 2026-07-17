import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../../../../prisma/generated/prisma/client.js';

export class TeacherDto {
  @ApiProperty({ type: String, example: 'teacherid123' })
  id!: string;

  @ApiProperty({ type: String, example: 'userid123' })
  userId!: string;

  @ApiProperty({ type: String, example: 'TCH-12345' })
  employeeCode!: string;

  @ApiPropertyOptional({ type: String, example: '123456789', nullable: true })
  phone?: string | null;

  @ApiPropertyOptional({ type: String, example: 'Yangon', nullable: true })
  address?: string | null;

  @ApiProperty({ enum: UserGender, example: UserGender.MALE })
  gender!: UserGender;

  @ApiPropertyOptional({
    type: String,
    example: '2005-08-24T00:00:00.000Z',
    nullable: true,
  })
  dateOfBirth?: string | null;
}
