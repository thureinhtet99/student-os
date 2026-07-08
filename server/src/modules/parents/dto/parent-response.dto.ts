import { ApiProperty } from '@nestjs/swagger';

// class ParentStudentDto {
//   @ApiProperty({ example: 'ckx123studentid' })
//   id!: string;
//   @ApiProperty({ example: 'John Doe' })
//   name!: string;
// }

export class ParentResponseDto {
  @ApiProperty({ example: 'ckx123parentid' })
  id!: string;

  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @ApiProperty({ example: '123-456-7890', nullable: true })
  phone!: string | null;

  @ApiProperty({ example: '123 Main St, Anytown, USA', nullable: true })
  address!: string | null;

  // @ApiProperty({
  //   type: () => [ParentStudentDto],
  //   nullable: true,
  //   example: [{ id: 'ckx123studentid', name: 'John Doe' }],
  // })
  // students!: { id: string; name: string }[] | null;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
