import { ApiProperty } from '@nestjs/swagger';

// class ClassSummaryForAnnouncementDto {
//   @ApiProperty({ example: 'classid123' })
//   id!: string;
// }

export class AnnouncementResponseDto {
  @ApiProperty({ example: 'announcementid123' })
  id!: string;

  @ApiProperty({ example: 'Announcement title' })
  title!: string;

  @ApiProperty({ example: 'Announcement description' })
  content!: string;

  @ApiProperty({ example: '2026-07-10T09:00:00.000Z' })
  publishedAt!: Date;

  @ApiProperty({ example: 'classid123', nullable: true })
  classId?: string | null;

  // @ApiPropertyOptional({ type: ClassSummaryForAnnouncementDto, nullable: true })
  // class?: ClassSummaryForAnnouncementDto | null;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  updatedAt!: Date;
}
