export class ResultResponseDto {
  id!: string;
  score!: number;
  comment!: string | null;
  exam!: { id: string; name: string } | null;
  assignment!: { id: string; name: string } | null;
  student!: { id: string; name: string } | null;
  created_at!: Date;
  updated_at!: Date;
}
