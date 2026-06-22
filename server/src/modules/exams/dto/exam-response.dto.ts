export class ExamResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  startTime!: Date;
  endTime!: Date;
  subject!: { id: string; name: string } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
