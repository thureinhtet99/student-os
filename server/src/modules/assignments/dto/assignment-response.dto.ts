export class AssignmentResponseDto {
  id!: string;
  name!: string;
  due_date!: Date | null;
  subject!: { id: string; name: string } | null;
  created_at!: Date;
  updated_at!: Date;
}
