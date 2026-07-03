import { SubjectResponseDto } from '../../modules/subjects/dto/subject-response.dto.js';
import { SubjectWithRelations } from '../types/subject.type.js';

export function formatSubject(
  subject: SubjectWithRelations,
): SubjectResponseDto {
  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    teachingAssignments: subject.teachingAssignments,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
  };
}
