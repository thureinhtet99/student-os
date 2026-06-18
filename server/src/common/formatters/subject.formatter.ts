import { SubjectResponseDto } from '../../modules/subjects/dto/subject-response.dto.js';
import { SubjectWithRelations } from '../types/subject.type.js';

export function formatSubject(
  subject: SubjectWithRelations,
): SubjectResponseDto {
  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    class: subject.class
      ? { id: subject.class.id, name: subject.class.name }
      : null,
    teachers: subject.teachers
      ? subject.teachers.map((t) => ({ id: t.id, name: t.name }))
      : [],
    created_at: subject.createdAt,
    updated_at: subject.updatedAt,
  };
}
