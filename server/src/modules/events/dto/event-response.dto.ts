export class EventResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  startTime!: Date;
  endTime!: Date;
  class!: { id: string; name: string } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
