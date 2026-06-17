import { LessonResponseDto } from '../../modules/lessons/dto/lesson-response.dto.js';
import { LessonWithRelations } from '../types/lesson.type.js';

export function formatLesson(lesson: LessonWithRelations): LessonResponseDto {
  return {
    id: lesson.id,
    name: lesson.name,
    subject: lesson.subject ? { id: lesson.subject.id, name: lesson.subject.name } : null,
    created_at: lesson.createdAt,
    updated_at: lesson.updatedAt,
  };
}
