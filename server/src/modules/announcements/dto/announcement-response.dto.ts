export class AnnouncementResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  date!: Date;
  class!: { id: string; name: string } | null;
  created_at!: Date;
  updated_at!: Date;
}
