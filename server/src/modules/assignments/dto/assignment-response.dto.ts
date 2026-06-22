export class AssignmentResponseDto {
  id!: string;
  name!: string;
  due_date!: Date | null;
  subject!: { id: string; name: string } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
