export class ParentResponseDto {
  id!: string;
  name!: string;
  phone!: string | null;
  address!: string | null;
  students!: { id: string; name: string }[] | null;
  created_at!: Date;
  updated_at!: Date;
}
