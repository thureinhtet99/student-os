import { ApiProperty } from '@nestjs/swagger';
import { TeachingAllocationDto } from '../../teaching-allocations/dto/teaching-allocation.dto';

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

  @ApiProperty({ type: [TeachingAllocationDto] })
  teachingAllocations!: TeachingAllocationDto[];

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
