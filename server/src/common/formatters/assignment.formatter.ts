import { AssignmentResponseDto } from '../../modules/assignments/dto/assignment-response.dto.js';
import { AssignmentWithRelations } from '../types/assignment.type.js';

export function formatAssignment(
  assignment: AssignmentWithRelations,
): AssignmentResponseDto {
  return {
    id: assignment.id,
    name: assignment.name,
    due_date: assignment.dueDate,
    subject: assignment.subject
      ? { id: assignment.subject.id, name: assignment.subject.name }
      : null,
    created_at: assignment.createdAt,
    updated_at: assignment.updatedAt,
  };
}
