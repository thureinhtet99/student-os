import { ParentResponseDto } from '../../modules/parents/dto/parent-response.dto.js';
import { ParentWithRelations } from '../types/parent.type.js';

export function formatParent(parent: ParentWithRelations): ParentResponseDto {
  return {
    id: parent.id,
    name: parent.name,
    phone: parent.phone,
    address: parent.address,
    students: parent.students
      ? parent.students.map((std) => ({
          id: std.id,
          name: std.name,
        }))
      : null,
    created_at: parent.createdAt,
    updated_at: parent.updatedAt,
  };
}
