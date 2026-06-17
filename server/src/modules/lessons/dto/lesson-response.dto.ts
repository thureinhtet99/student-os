export class LessonResponseDto {
  id!: string;
  name!: string;
  subject!: { id: string; name: string } | null;
  created_at!: Date;
  updated_at!: Date;
}
