export class AnnouncementResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  date!: Date;
  class!: { id: string; name: string } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
