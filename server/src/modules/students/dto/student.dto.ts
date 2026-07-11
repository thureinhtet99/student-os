import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../../../../prisma/generated/prisma/client';

export class StudentDto {
  @ApiProperty({ type: String, example: 'studentid123' })
  id!: string;

  @ApiProperty({ type: String, example: 'userid123' })
  userId!: string;

  @ApiProperty({ type: String, example: 'STU-12345' })
  studentNumber!: string;

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
