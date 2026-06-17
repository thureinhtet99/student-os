export class AttendanceResponseDto {
  id!: string;
  present!: boolean;
  date!: Date;
  student!: { id: string; name: string } | null;
  created_at!: Date;
  updated_at!: Date;
}
