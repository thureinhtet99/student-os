export class ClassResponseDto {
  id!: string;

  name!: string;

  teacher!: { id: string; name: string } | null;

  // students!: Omit<Student, 'password'>[] | null;

  // subjects!: Omit<Subject, 'createdAt' | 'updatedAt'>[] | null;

  // events!: Omit<Event, 'createdAt' | 'updatedAt'>[] | null;

  // announcements!: Omit<Announcement, 'createdAt' | 'updatedAt'>[] | null;

  created_at!: Date;

  updated_at!: Date;
}
