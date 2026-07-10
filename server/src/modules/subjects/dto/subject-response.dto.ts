import { ApiProperty } from '@nestjs/swagger';
import { TeachingAllocationDto } from '../../teaching-allocations/dto/teaching-allocation.dto';

export class SubjectResponseDto {
  @ApiProperty({ example: 'ckx123subjectid' })
  id!: string;

  @ApiProperty({ example: 'Mathematics' })
  name!: string;

  @ApiProperty({ example: 'Advanced algebra and calculus', nullable: true })
  description!: string | null;

  @ApiProperty({ type: [TeachingAllocationDto] })
  teachingAllocations!: TeachingAllocationDto[];

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
