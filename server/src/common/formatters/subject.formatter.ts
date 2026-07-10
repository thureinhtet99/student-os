import { SubjectResponseDto } from '../../modules/subjects/dto/subject-response.dto.js';
import { SubjectWithRelations } from '../types/subject.type.js';

export function formatSubject(
  subject: SubjectWithRelations,
): SubjectResponseDto {
  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    teachingAllocations: subject.teachingAllocations.map((ta) => ({
      id: ta.id,
      classId: ta.classId,
      teacherId: ta.teacherId,
      subjectId: subject.id,
    })),
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
  };
}
