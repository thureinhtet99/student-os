export class AnnouncementResponseDto {
  id!: string;
  title!: string;
  content!: string;
  date!: Date;
  class!: { id: string; name: string } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
