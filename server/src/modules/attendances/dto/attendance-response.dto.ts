export class AttendanceResponseDto {
  id!: string;
  present!: boolean;
  date!: Date;
  student!: { id: string; name: string } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
