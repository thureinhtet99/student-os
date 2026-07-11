import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../../../../prisma/generated/prisma/browser';

export class TeacherDto {
  @ApiProperty({ type: String, example: 'ckx123userid' })
  id!: string;

  @ApiProperty({ type: String, example: 'userid123' })
  userId!: string;

  @ApiProperty({ type: String, example: 'TCH-12345' })
  employeeCode!: string;

  @ApiProperty({ type: String, example: '123456789' })
  phone!: string;

  @ApiProperty({ type: String, example: 'Yangon' })
  address!: string;

  @ApiProperty({ type: String, example: 'A' })
  bloodGroup!: string;

  @ApiProperty({ type: Boolean, example: 'MALE' })
  gender!: UserGender;

  @ApiProperty({ type: String, example: 'MALE' })
  dateOfBirth!: string;
}
