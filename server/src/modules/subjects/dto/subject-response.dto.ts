export class SubjectResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  class!: { id: string; name: string } | null;
  teachers!: { id: string; name: string }[];
  created_at!: Date;
  updated_at!: Date;
}
