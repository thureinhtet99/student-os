import { ApiProperty } from '@nestjs/swagger';

class ClassDto {
  @ApiProperty({ example: 'ckx123classid' })
  id!: string;
  @ApiProperty({ example: 'Grade 10 A' })
  name!: string;
}

class SubjectDto {
  @ApiProperty({ example: 'ckx123subjectid' })
  id!: string;
  @ApiProperty({ example: 'Mathematics' })
  name!: string;
}

export class TeacherResponseDto {
  @ApiProperty({ example: 'ckx123userid' })
  id!: string;

  @ApiProperty({ example: 'TCH-12345' })
  teacherId!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'http://example.com/image.png', nullable: true })
  image!: string | null;

  @ApiProperty({ type: [ClassDto] })
  classes!: ClassDto[];

  @ApiProperty({ type: [SubjectDto] })
  subjects!: SubjectDto[];

  @ApiProperty({ nullable: true })
  setPasswordToken!: string | null;

  @ApiProperty({ nullable: true })
  setPasswordTokenExpires!: Date | null;

  @ApiProperty({ nullable: true })
  resetPasswordToken!: string | null;

  @ApiProperty({ nullable: true })
  resetPasswordTokenExpires!: Date | null;

  @ApiProperty({ nullable: true })
  lastLoginAt!: Date | null;
}
