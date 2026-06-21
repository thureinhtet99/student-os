export class ParentResponseDto {
  id!: string;
  name!: string;
  phone!: string | null;
  address!: string | null;
  students!: { id: string; name: string }[] | null;
  createdAt!: Date;
  updatedAt!: Date;
}
