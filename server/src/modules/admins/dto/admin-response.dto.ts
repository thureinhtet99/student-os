import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
  @ApiProperty({ example: 'ckx123adminid' })
  id!: string;

  @ApiProperty({ example: 'ADM-abc123456789' })
  employeeCode!: string;

  @ApiProperty({ example: 'ckx123userid' })
  userId!: string;

  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiProperty({ example: 'ADMIN', enum: ['SUPER_ADMIN', 'ADMIN'] })
  role!: string;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
