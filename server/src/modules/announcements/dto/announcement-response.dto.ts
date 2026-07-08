import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementResponseDto {
  @ApiProperty({ example: 'ckx123announcementid' })
  id!: string;

  @ApiProperty({ example: 'School closed Friday' })
  title!: string;

  @ApiProperty({ example: 'Reminder that school is closed...' })
  content!: string;

  @ApiProperty({ example: '2026-07-10T09:00:00.000Z' })
  publishedAt!: Date;

  @ApiProperty({ example: 'ckx123classid', nullable: true })
  classId!: string | null;

  @ApiProperty({ example: 'Grade 10 A', nullable: true })
  className!: string | null;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
